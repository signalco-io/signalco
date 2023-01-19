import { FormControl, FormHelperText, FormLabel, Input, InputProps } from "@mui/joy";
import { ReactNode } from "react";

export type TextFieldProps = InputProps & {
    label?: ReactNode | string | undefined,
    helperText?: ReactNode | string | undefined
};

export default function TextField({ label, helperText, ...rest }: TextFieldProps) {
    return (
        <FormControl>
            {label && <FormLabel>{label}</FormLabel>}
            <Input {...rest} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    )
}
