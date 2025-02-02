import { MouseEvent, type PropsWithChildren, useState } from 'react';
import { Popper } from '@signalco/ui-primitives/Popper';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Copy, Warning } from '@signalco/ui-icons';
import { Alert } from '../Alert';

export type IconButtonCopyToClipboardProps = PropsWithChildren<{
    title: string;
    value?: unknown;
    defaultValue?: unknown;
    className?: string | undefined;
    successMessage: string,
    errorMessage: string
}>;

export function IconButtonCopyToClipboard(props: IconButtonCopyToClipboardProps) {
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleClickShowCopyToClipboard = (event: MouseEvent<HTMLButtonElement>) => {
        try {
            const value = props.value || props.defaultValue;
            if (typeof value === 'string') {
                navigator.clipboard.writeText(value);
                setError(false);
            } else {
                setError(true);
            }
        } catch (error) {
            console.warn('Failed to copy to clipboard', error);
            setError(true);
        } finally {
            if (event.target) {
                setNotificationOpen(true);
                setTimeout(() => setNotificationOpen(false), 2000);
            }
        }
    };

    const handleMouseDownCopyToClipboard = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Popper
            open={notificationOpen}
            className="border-0 bg-transparent"
            anchor={(
                <IconButton
                    size="md"
                    className={props.className}
                    title={props.title}
                    variant="plain"
                    aria-label={props.title}
                    onClick={handleClickShowCopyToClipboard}
                    onMouseDown={handleMouseDownCopyToClipboard}>
                    {props.children ? props.children : <Copy />}
                </IconButton>
            )}>
            <Alert color={error ? 'warning' : 'neutral'} startDecorator={error && <Warning />}>
                {error ? props.errorMessage : props.successMessage}
            </Alert>
        </Popper>
    );
}
