import { FormControlLabel, Checkbox as MuiCheckbox, SxProps, Theme } from '@mui/material';
import { ChangeEvent, ReactNode } from 'react';

export interface CheckboxProps {
    checked: boolean;
    readonly?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    sx?: SxProps<Theme> | undefined;
    label: ReactNode;
}

export default function Checkbox(props: CheckboxProps) {
    const { checked, readonly, onChange, sx, label } = props;

    return (
        <FormControlLabel
            control={<MuiCheckbox readOnly={readonly} sx={{ cursor: readonly ? 'default' : 'unset' }} disableRipple={readonly} checked={checked} onChange={onChange} />}
            sx={{ ...sx, cursor: readonly ? 'default' : 'unset' }}
            label={label} />
    );
}
