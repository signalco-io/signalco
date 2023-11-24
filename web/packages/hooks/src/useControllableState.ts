import { useCallback, useState } from 'react';
import { useCallbackRef } from './useCallbackRef';

type SetStateFn<T> = (prevState?: T) => T;

export function useControllableState<T>(value: T | undefined, defaultValue?: T | undefined, onChange?: (newValue: T) => void) {
    const [state, setState] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : state;
    const setValueCallback = useCallbackRef(onChange);

    const setValue = useCallback(
        (nextValue: T | undefined) => {
            if (isControlled) {
                const setter = nextValue as SetStateFn<T>;
                const currentValue = typeof nextValue === 'function' ? setter(value) : nextValue;
                if (currentValue !== value) setValueCallback(currentValue as T);
            } else {
                setState(nextValue);
            }
        },
        [isControlled, setValueCallback, value, setState]
    );

    return [currentValue, setValue] as const;
}
