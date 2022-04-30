import { FilledInput, FilledInputProps, FormControl, InputAdornment, InputLabel } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import React from 'react';
import IconButtonCopyToClipboard from './IconButtonCopyToClipboard';

export interface CopyToClipboardInputProps extends FilledInputProps {
    label?: string | undefined
};

export const LabelWrapper = (props: { children: React.ReactNode, variant: 'standard' | 'outlined' | 'filled', options: CopyToClipboardInputProps }) => {
    if (props.options.label) {
        return (
            <FormControl fullWidth variant={props.variant}>
                <InputLabel id={`${props.options.id}-label`}>Base address</InputLabel>
                {props.children}
            </FormControl>
        );
    }
    return <>{props.children}</>;
}

const CopyToClipboardInput = (props: CopyToClipboardInputProps) => {
    if (!props.id) throw 'CopyToClipboardInput requires id';

    return (
        <>
            <LabelWrapper variant="filled" options={props}>
                <FilledInput
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButtonCopyToClipboard edge id={props.id} title="Copy to clipboard" value={props.value} defaultValue={props.defaultValue}>
                                <ContentCopyIcon fontSize={props.size} />
                            </IconButtonCopyToClipboard>
                        </InputAdornment>
                    } {...props} />
            </LabelWrapper>
        </>
    );
};

export default CopyToClipboardInput;
