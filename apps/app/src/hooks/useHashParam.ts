import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const useHashParam = (parameterName: string): [string | undefined, (value: string| undefined) => Promise<void>] => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const lastHash = searchParams.get(parameterName) ?? undefined;

    const setHashAsync = useCallback(async (value: string | undefined) => {
        const newSearch = new URLSearchParams(searchParams);
        if (value)
            newSearch.set(parameterName, value);
        else newSearch.delete(parameterName);
        const newUrl = new URL(window.location.href);
        newUrl.search = newSearch.toString();
        router.replace(newUrl.toString());
    }, [parameterName, router, searchParams]);

    return [lastHash, setHashAsync];
};

export default useHashParam;
