import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { StringOrUndefined } from '@signalco/js';

export function useSearchParam<S extends string | undefined>(parameterName: string, defaultValue?: S): [StringOrUndefined<S>, (value: string | undefined) => Promise<void>] {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentValue = searchParams.get(parameterName) ?? defaultValue;

    const setHashAsync = useCallback(async (value: string | undefined) => {
        const currentSearch = new URLSearchParams(Array.from(searchParams.entries()));

        if (value)
            currentSearch.set(parameterName, value);
        else currentSearch.delete(parameterName);

        const search = currentSearch.toString();
        const query = search ? `?${search}` : '';

        router.replace(`${pathname}${query}`, undefined)
    }, [parameterName, router, searchParams, pathname]);

    return [currentValue as StringOrUndefined<S>, setHashAsync];
}
