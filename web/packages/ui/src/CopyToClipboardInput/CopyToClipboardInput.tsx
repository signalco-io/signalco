import { Input, type InputProps } from '@signalco/ui-primitives/Input';
import { Copy } from '@signalco/ui-icons';
import { IconButtonCopyToClipboard } from '../IconButtonCopyToClipboard';

export type CopyToClipboardInputProps = InputProps;

export function CopyToClipboardInput(props: CopyToClipboardInputProps) {
    return (
        <Input
            endDecorator={
                <IconButtonCopyToClipboard
                    title="Copy to clipboard"
                    value={props.value}
                    defaultValue={props.defaultValue}
                    successMessage={'Copied'}
                    errorMessage={'Failed to copy'}>
                    <Copy />
                </IconButtonCopyToClipboard>
            }
            {...props} />
    );
}
