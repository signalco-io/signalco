import React, { MouseEvent, useState } from 'react';
import {
    bindPopper,
    usePopupState
} from 'material-ui-popup-state/hooks';
import Popper from '@mui/material/Popper';
import { Fade, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { ChildrenProps } from '../../../src/sharedTypes';
import { useLocaleHelpers } from '../../../src/hooks/useLocale';

export type IconButtonCopyToClipboardProps = ChildrenProps & {
    id: string;
    title: string;
    value?: unknown;
    defaultValue?: unknown;
    className?: string | undefined;
    edge?: boolean | 'start' | 'end' | undefined;
};

export default function IconButtonCopyToClipboard(props: IconButtonCopyToClipboardProps) {
    if (!props.id)
        throw 'CopyToClipboardInput requires id';
    const { t } = useLocaleHelpers();
    const popupState = usePopupState({ variant: 'popper', popupId: `copytoclipboard-button-${props.id}` });
    const [error, setError] = useState<boolean>(false);

    const handleClickShowCopyToClipboard = (event: MouseEvent<HTMLButtonElement>) => {
        try {
            const value = props.value || props.defaultValue;
            if (value && typeof value === 'string') {
                navigator.clipboard.writeText(value);
                setError(false);
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
            <Tooltip title={props.title} className={props.className}>
                <IconButton
                    size="medium"
                    edge={props.edge === true ? 'end' : props.edge}
                    aria-label={props.title}
                    onClick={handleClickShowCopyToClipboard}
                    onMouseDown={handleMouseDownCopyToClipboard}>
                    {props.children}
                </IconButton>
            </Tooltip>
            <Popper sx={{ zIndex: 999999 }} {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper sx={{ p: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {error && <Warning color="warning" />}
                                <Typography>
                                    {!error ? t('CopyToClipboardSuccess') : t('CopyToClipboardError')}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    );
}
