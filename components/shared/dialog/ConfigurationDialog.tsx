import { Close } from "@mui/icons-material";
import { Breakpoint, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

interface IConfigurationDialogProps {
    isOpen: boolean,
    title: React.ReactNode,
    onClose: () => void,
    children: React.ReactNode,
    maxWidth?: false | undefined | Breakpoint,
    actions?: React.ReactNode
}

const ConfigurationDialog = (props: IConfigurationDialogProps) => {
    const { children, title, isOpen, onClose, maxWidth = "tablet", actions } = props;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 760;

    return (
        <Dialog open={isOpen} maxWidth={maxWidth} fullWidth fullScreen={isMobile} scroll="paper">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h2">{title}</Typography>
                    <IconButton title="Close" onClick={() => onClose()}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            {actions && (
                <DialogActions>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default ConfigurationDialog;