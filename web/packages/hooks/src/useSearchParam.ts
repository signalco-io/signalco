import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { StringOrUndefined } from '@signalco/js';

export function useSetSearchParam(parameterName: string): (value: string | undefined) => void {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const setSearchParam = useCallback((value: string | undefined) => {
        // Ignore if value is the same as current value
        const currentValue = searchParams.get(parameterName);
        if (currentValue === value ||
            currentValue == null && value == null) {
            console.debug('useSearchParam: Ignoring because value', parameterName, 'is the same as current value', parameterName, value, '===', currentValue);
            return;
        }

        console.debug('useSearchParam: Setting value', parameterName, ' from', currentValue, 'to', value);

        const currentSearch = new URLSearchParams(Array.from(searchParams.entries()));
        if (value)
            currentSearch.set(parameterName, value);
        else currentSearch.delete(parameterName);

        const search = currentSearch.toString();
        const query = search ? `?${search}` : '';
        const url = `${pathname}${query}`;

        console.debug(`useSearchParam: ${parameterName}=${value}`, url);

        router.replace(url);
    }, [parameterName, router, searchParams, pathname]);

    return setSearchParam;
}

export function useSearchParam<S extends string | undefined>(parameterName: string, defaultValue?: S): [StringOrUndefined<S>, (value: string | undefined) => void] {
    const searchParams = useSearchParams();
    const currentValue = searchParams.get(parameterName) ?? defaultValue;
    const setSearchParam = useSetSearchParam(parameterName);

    return [currentValue as StringOrUndefined<S>, setSearchParam];
}
