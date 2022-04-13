import { useCallback, useState } from "react";
import UserSettingsProvider from "../services/UserSettingsProvider";
import { ValueOrFuncGeneric } from "../sharedTypes";

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
