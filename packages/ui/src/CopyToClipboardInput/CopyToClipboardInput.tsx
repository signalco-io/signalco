import { Copy } from '@signalco/ui-icons';
import IconButtonCopyToClipboard from '../IconButtonCopyToClipboard';
import TextField, { TextFieldProps } from '../TextField';

export type CopyToClipboardInputProps = TextFieldProps;

export default function CopyToClipboardInput(props: TextFieldProps) {
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
