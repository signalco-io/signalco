import React from 'react';
import { TextField, TextFieldProps } from '@mui/joy';
import { Copy } from '../Icons';
import IconButtonCopyToClipboard from '../buttons/IconButtonCopyToClipboard';

function CopyToClipboardInput(props: TextFieldProps) {
    return (
        <TextField
            endDecorator={
                <IconButtonCopyToClipboard
                    title="Copy to clipboard"
                    value={props.value}
                    defaultValue={props.defaultValue}>
                    <Copy fontSize={props.size === 'sm' ? 16 : (props.size === 'lg' ? 32 : 24)} />
                </IconButtonCopyToClipboard>
            } {...props} />
    );
}

export default CopyToClipboardInput;
