import React, { MouseEvent, useId, useState } from 'react';
import {
    bindPopper,
    usePopupState
} from 'material-ui-popup-state/hooks';
import Popper from '@mui/material/Popper';
import { Alert, IconButton } from '@mui/joy';
import { Warning, CopyAll as CopyAllIcon } from '@mui/icons-material';
import Fade from '../animations/Fade';
import { ChildrenProps } from '../../../src/sharedTypes';
import { useLocaleHelpers } from '../../../src/hooks/useLocale';

export type IconButtonCopyToClipboardProps = ChildrenProps & {
    title: string;
    value?: unknown;
    defaultValue?: unknown;
    className?: string | undefined;
};

export default function IconButtonCopyToClipboard(props: IconButtonCopyToClipboardProps) {
    const id = useId();
    const { t } = useLocaleHelpers();
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
                {props.children ? props.children : <CopyAllIcon />}
            </IconButton>
            <Popper sx={{ zIndex: 999999 }} {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                    <Fade appear={TransitionProps?.in ?? false} duration={350}>
                        <Alert color={error ? 'warning' : 'neutral'} startDecorator={error && <Warning color="warning" />}>{!error ? t('CopyToClipboardSuccess') : t('CopyToClipboardError')}</Alert>
                    </Fade>
                )}
            </Popper>
        </>
    );
}
