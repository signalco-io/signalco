import { Fade, IconButton, InputAdornment, OutlinedInput, OutlinedInputProps, Paper, Stack, Typography } from "@mui/material";
import { ContentCopy as ContentCopyIcon, Warning } from "@mui/icons-material";
import React, { MouseEvent, useState } from "react";
import Popper from '@mui/material/Popper'
import {
    usePopupState,
    bindPopper,
} from 'material-ui-popup-state/hooks';

export type CopyToClipboardInputProps = OutlinedInputProps;

const CopyToClipboardInput = (props: CopyToClipboardInputProps) => {
    const popupState = usePopupState({ variant: 'popper', popupId: `copytoclipboard-input-${props.id}` });
    const [error, setError] = useState<boolean>(false);

    const handleClickShowCopyToClipboard = (event: MouseEvent<HTMLButtonElement>) => {
        try {
            const value = props.value || props.defaultValue;
            if (value && typeof value === 'string') {
                navigator.clipboard.writeText(value);
                setError(false);
            }
        } catch (error) {
            console.warn("Failed to copy to clipboard", error);
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
            <OutlinedInput
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowCopyToClipboard}
                            onMouseDown={handleMouseDownCopyToClipboard}>
                            <ContentCopyIcon />
                        </IconButton>
                    </InputAdornment>
                } {...props}></OutlinedInput>
            <Popper {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper sx={{ p: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {error && <Warning color="warning" />}
                                <Typography>
                                    {!error ? "Copied to clipboard" : "Failed to copy to clipboard"}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    );
};

export default CopyToClipboardInput;