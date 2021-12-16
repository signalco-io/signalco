import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

function parseHash() {
    return new URLSearchParams(
        window.location.hash.substr(1) // skip the first char (#)
    );
}

function parseHashParam(paramName: string) {
    return Object.fromEntries(parseHash())[paramName];
}

const useHashParam = (parameterName: string): [string | undefined, (value: string| undefined) => void] => {
    const [lastHash, setLastHash] = useState<string | undefined>(parseHashParam(parameterName));
    const router = useRouter();

    const onHashChanged = useCallback(() => {
        setLastHash(parseHashParam(parameterName));
    }, [parameterName]);

    const setHashAsync = async (value: string | undefined) => {
        const hash = parseHash();
        if (typeof value === 'undefined' || value.length <= 0)
          hash.delete(parameterName);
        else hash.set(parameterName, value);

        try {
            await router.push({hash: hash.toString()})
        } catch(err) {
            console.warn(`Failed to set new hash code to "${hash}"`);
        }
    }

    useEffect(() => {
        window.addEventListener("hashchange", onHashChanged);

        if (lastHash !== location.hash) {
            onHashChanged();
        }

        return () => {
            window.removeEventListener("hashchange", onHashChanged);
        };
    }, [lastHash, onHashChanged]);

    return [lastHash, setHashAsync];
};

export default useHashParam;