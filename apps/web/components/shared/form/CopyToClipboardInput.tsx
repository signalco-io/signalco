import React from 'react';
import { Copy } from '@signalco/ui-icons';
import {IconButtonCopyToClipboard} from '@signalco/ui-client';
import { TextField, TextFieldProps } from '@signalco/ui';

function CopyToClipboardInput(props: TextFieldProps) {
    return (
        <TextField
            endDecorator={
                <IconButtonCopyToClipboard
                    title="Copy to clipboard"
                    value={props.value}
                    defaultValue={props.defaultValue}
                    successMessage={'Copied'}
                    errorMessage={'Failed to copy'}>
                    <Copy fontSize={props.size === 'sm' ? 16 : (props.size === 'lg' ? 32 : 24)} />
                </IconButtonCopyToClipboard>
            } {...props} />
    );
}

export default CopyToClipboardInput;
