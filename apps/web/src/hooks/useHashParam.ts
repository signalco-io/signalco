import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// TODO: Move to shared library

export function parseHash() {
    if (typeof window === 'undefined') {
        return new URLSearchParams();
    }

    return new URLSearchParams(
        window.location.hash.substring(1) // skip the first char (#)
    );
}

export function parseHashParam(paramName: string) {
    return Object.fromEntries(parseHash())[paramName];
}

const useHashParam = (parameterName: string): [string | undefined, (value: string| undefined) => Promise<void>] => {
    const [lastHash, setLastHash] = useState<string | undefined>(parseHashParam(parameterName));
    const router = useRouter();

    const onHashChanged = useCallback(() => {
        const newHash = parseHashParam(parameterName);
        if (newHash !== lastHash) {
            setLastHash(newHash);
        }
    }, [parameterName, lastHash]);

    const setHashAsync = useCallback(async (value: string | undefined) => {
        // Update current hash with new value
        const hash = parseHash();
        if (typeof value === 'undefined' || value.length <= 0)
          hash.delete(parameterName);
        else hash.set(parameterName, value);

        try {
            await router.push({ hash: hash.toString() }, undefined, { shallow: true });
        } catch (err) {
            console.warn(`Failed to set new hash code to "${hash}"`);
        }
    }, [parameterName, router]);

    useEffect(() => {
        if (router.asPath) {
            onHashChanged();
        }
    }, [router.asPath, onHashChanged])

    return [lastHash, setHashAsync];
};

export default useHashParam;
