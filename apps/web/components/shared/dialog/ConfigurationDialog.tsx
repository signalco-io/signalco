import React from 'react';
import { Modal, ModalClose, ModalDialog, Typography, Breakpoint, Stack, Row, Box } from '@signalco/ui';

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
                    <Row justifyContent="space-between">
                        <Typography level="h5">{header}</Typography>
                        <Box sx={{ mt: -1.5, mr: 4 }}>
                            <Row spacing={1}>
                                {headerActions}
                            </Row>
                        </Box>
                    </Row>
                    {children}
                    {actions && (
                        <Row spacing={1} justifyContent="end">
                            {actions}
                        </Row>
                    )}
                </Stack>
            </ModalDialog>
        </Modal>
    );
}

export default ConfigurationDialog;
