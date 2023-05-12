import React from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Modal, ModalClose, ModalDialog } from '@signalco/ui/dist/Modal';

export interface IConfigurationDialogProps {
    isOpen: boolean,
    header: React.ReactNode,
    headerActions?: React.ReactNode,
    onClose: () => void,
    children: React.ReactNode,
    maxWidth?: false | undefined | 'sm' | 'md' | 'lg' | 'xl',
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
                        <Row spacing={1}>
                            {headerActions}
                        </Row>
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
