import { Fade, FilledInput, FilledInputProps, FormControl, IconButton, InputAdornment, InputLabel, Paper, Stack, Typography } from "@mui/material";
import { ContentCopy as ContentCopyIcon, Warning } from "@mui/icons-material";
import React, { MouseEvent, useState } from "react";
import Popper from '@mui/material/Popper'
import {
    usePopupState,
    bindPopper,
} from 'material-ui-popup-state/hooks';

export interface CopyToClipboardInputProps extends FilledInputProps {
    label?: string | undefined
};

export const LabelWrapper = (props: { children: React.ReactNode, variant: 'standard' | 'outlined' | 'filled', options: CopyToClipboardInputProps }) => {
    if (props.options.label) {
        return (
            <FormControl fullWidth variant={props.variant}>
                <InputLabel id={`${props.options.id}-label`}>Base address</InputLabel>
                {props.children}
            </FormControl>
        );
    }
    return <>{props.children}</>;
}

const CopyToClipboardInput = (props: CopyToClipboardInputProps) => {
    if (!props.id) throw 'CopyToClipboardInput required id';
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
            <LabelWrapper variant="filled" options={props}>
                <FilledInput
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                edge="end"
                                aria-label="toggle password visibility"
                                onClick={handleClickShowCopyToClipboard}
                                onMouseDown={handleMouseDownCopyToClipboard}>
                                <ContentCopyIcon fontSize={props.size} />
                            </IconButton>
                        </InputAdornment>
                    } {...props} />
            </LabelWrapper>
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