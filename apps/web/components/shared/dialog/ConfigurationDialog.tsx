import React from 'react';
import { Modal, ModalClose, ModalDialog, Typography } from '@signalco/ui';
import { Breakpoint, Stack } from '@mui/system';

export interface IConfigurationDialogProps {
    isOpen: boolean,
    header: React.ReactNode,
    headerActions?: React.ReactNode,
    onClose: () => void,
    children: React.ReactNode,
    maxWidth?: false | undefined | Breakpoint,
    actions?: React.ReactNode
}

function ConfigurationDialog({
    children, header, headerActions, isOpen, onClose, maxWidth = 'sm', actions
}: IConfigurationDialogProps) {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <ModalDialog
                sx={{
                    width: '100%',
                    maxWidth: maxWidth ? maxWidth : undefined
                }}>
                <ModalClose />
                <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography level="h5">{header}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: -1.5, mr: 4 }}>
                            {headerActions}
                        </Stack>
                    </Stack>
                    {children}
                    {actions && (
                        <Stack direction="row" spacing={1} justifyContent="end">
                            {actions}
                        </Stack>
                    )}
                </Stack>
            </ModalDialog>
        </Modal>
    );
}

export default ConfigurationDialog;
