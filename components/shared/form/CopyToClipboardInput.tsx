import React from 'react';
import { TextField, TextFieldProps } from '@mui/joy';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import IconButtonCopyToClipboard from '../buttons/IconButtonCopyToClipboard';

function CopyToClipboardInput(props: TextFieldProps) {
    let fontSize: 'small' | 'medium' | 'large' = 'medium';
    switch (props.size) {
        case 'sm':
            fontSize = 'small';
            break;
        case 'lg':
            fontSize = 'large';
    }

    return (
        <TextField
            endDecorator={
                <IconButtonCopyToClipboard
                    title="Copy to clipboard"
                    value={props.value}
                    defaultValue={props.defaultValue}>
                    <ContentCopyIcon fontSize={fontSize} />
                </IconButtonCopyToClipboard>
            } {...props} />
    );
}

export default CopyToClipboardInput;
