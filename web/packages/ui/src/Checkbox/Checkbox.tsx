import { ChangeEvent, ReactNode } from 'react';
import { Checkbox as JoyCheckbox } from '@mui/joy';

export type CheckboxProps = {
    checked: boolean;
    readonly?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    label?: ReactNode;
    disableIcon?: boolean;
}

export function Checkbox(props: CheckboxProps) {
    const { checked, readonly, onChange, label, disableIcon } = props;

    return (
        <JoyCheckbox
            label={label}
            sx={{
                'input': {
                    cursor: readonly ? 'default' : 'pointer'
                },
                '.JoyCheckbox-checkbox:hover': {
                    backgroundColor: readonly ? 'var(--joy-palette-primary-solidBg)' : undefined
                }
            }}
            readOnly={readonly}
            checked={checked}
            disableIcon={disableIcon}
            variant={disableIcon && !checked ? 'plain' : 'solid'}
            onChange={onChange} />
    );
}
