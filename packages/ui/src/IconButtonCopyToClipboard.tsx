import { MouseEvent, useId, useState } from 'react';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { Copy, Warning } from '@signalco/ui-icons';
import { Alert, IconButton } from '@mui/joy';
import {Popper} from './Popper';
import { ChildrenProps } from './sharedTypes';

export type IconButtonCopyToClipboardProps = ChildrenProps & {
    title: string;
    value?: unknown;
    defaultValue?: unknown;
    className?: string | undefined;
    successMessage: string,
    errorMessage: string
};

export function IconButtonCopyToClipboard(props: IconButtonCopyToClipboardProps) {
    const id = useId();
    const popupState = usePopupState({ variant: 'popper', popupId: `copytoclipboard-button-${id}` });
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
                popupState.open(event.currentTarget);
                setTimeout(() => popupState.close(), 2000);
            }
        }
    };

    const handleMouseDownCopyToClipboard = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
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
            <Popper popupState={popupState}>
                <Alert color={error ? 'warning' : 'neutral'} startDecorator={error && <Warning />}>
                    {error ? props.errorMessage : props.successMessage}
                </Alert>
            </Popper>
        </>
    );
}
