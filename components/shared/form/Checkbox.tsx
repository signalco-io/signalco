import { ChangeEvent, ReactNode } from 'react';
import { SxProps } from '@mui/system';
import { Checkbox as JoyCheckbox } from '@mui/joy';

export interface CheckboxProps {
    checked: boolean;
    readonly?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    sx?: SxProps | undefined;
    label: ReactNode;
    disableIcon?: boolean;
}

export default function Checkbox(props: CheckboxProps) {
    const { checked, readonly, onChange, sx, label, disableIcon } = props;

    return (
        <JoyCheckbox
            label={label}
            sx={{
                ...sx,
                'input': {
                    cursor: readonly ? 'default' : 'unset'
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
