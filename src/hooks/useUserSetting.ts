import { useCallback, useState } from "react";
import LocalStorageService from "../services/LocalStorageService";
import { ValueOrFuncGeneric } from "../sharedTypes";

const useUserSetting = <T>(key: string, defaultValue: ValueOrFuncGeneric<T>): [T | undefined, (value: T | undefined) => void] => {
    const [value, setValue] = useState<T | undefined>(LocalStorageService.getItemOrDefault<T>(key, defaultValue));
    const setNewValue = useCallback((value: T | undefined) => {
        LocalStorageService.setItem(key, value);
        setValue(value);
    }, [key]);
    return [value, setNewValue];
};

export default useUserSetting;