import CloseIcon from '@mui/icons-material/Close';
import { Breakpoint, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';

export interface IConfigurationDialogProps {
    isOpen: boolean,
    title: React.ReactNode,
    titleActions?: React.ReactNode,
    onClose: () => void,
    noPadding?: boolean,
    children: React.ReactNode,
    maxWidth?: false | undefined | Breakpoint,
    actions?: React.ReactNode
}

function ConfigurationDialog(props: IConfigurationDialogProps) {
    const { children, title, titleActions, isOpen, onClose, maxWidth = 'sm', noPadding, actions } = props;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 760;

    return (
        <Dialog open={isOpen} maxWidth={maxWidth} fullWidth fullScreen={isMobile} scroll="paper" onClose={onClose}>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h2">{title}</Typography>
                    <Stack direction="row" spacing={1}>
                        {titleActions}
                        <IconButton size="large" title="Close" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ padding: noPadding ? 0 : 3 }}>
                {children}
            </DialogContent>
            {actions && (
                <DialogActions>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
}

export default ConfigurationDialog;
