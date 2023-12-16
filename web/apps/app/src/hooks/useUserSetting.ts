import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ValueOrFuncGeneric } from '@signalco/js';
import UserSettingsProvider from '../services/UserSettingsProvider';

export const useUserSettingAsync = <T>(key: string, defaultValue: ValueOrFuncGeneric<T>): [T | undefined | null, (value: T | undefined) => void] => {
    const client = useQueryClient();
    const queryKey = ['settings', 'user', key];
    const query = useQuery({
        queryKey,
        queryFn: async () => UserSettingsProvider.value(key, defaultValue) ?? null,
        initialData: UserSettingsProvider.value(key, defaultValue),
        staleTime: 60 * 1000
    });
    const mutation = useMutation({
        mutationFn: async (newValue: T | undefined) => {
            UserSettingsProvider.set(key, newValue);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey });
        }
    });

    return [query.data, mutation.mutate];
};

const useUserSetting = <T>(key: string, defaultValue: ValueOrFuncGeneric<T>): [T | undefined, (value: T | undefined) => void] => {
    const [value, setValue] = useState<T | undefined>(UserSettingsProvider.value(key, defaultValue));
    const setNewValue = useCallback((newValue: T | undefined) => {
        if (value === newValue) return;

        UserSettingsProvider.set(key, newValue);
        setValue(newValue);
    }, [value, key]);
    return [value, setNewValue];
};

export default useUserSetting;
