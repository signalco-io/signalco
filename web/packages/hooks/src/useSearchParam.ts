import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StringOrUndefined } from '@signalco/js';

export function useSearchParam<S extends string | undefined>(parameterName: string, defaultValue?: S): [StringOrUndefined<S>, (value: string | undefined) => Promise<void>] {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentValue = searchParams.get(parameterName) ?? defaultValue;

    const setHashAsync = useCallback(async (value: string | undefined) => {
        const newSearch = new URLSearchParams({ ...searchParams.entries });
        if (value)
            newSearch.set(parameterName, value);
        else newSearch.delete(parameterName);
        const newUrl = new URL(window.location.href);
        newUrl.search = newSearch.toString();
        router.replace(newUrl.toString());
    }, [parameterName, router, searchParams]);

    return [currentValue as StringOrUndefined<S>, setHashAsync];
}
