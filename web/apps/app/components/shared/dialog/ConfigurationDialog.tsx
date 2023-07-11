import React from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Modal } from '@signalco/ui/dist/Modal';

export interface IConfigurationDialogProps {
    open?: boolean;
    header: React.ReactNode,
    headerActions?: React.ReactNode,
    onClose?: () => void,
    children: React.ReactNode,
    actions?: React.ReactNode,
    trigger?: React.ReactNode
}

function ConfigurationDialog({
    children, header, headerActions, open, onClose, actions
}: IConfigurationDialogProps) {
    return (
        <Modal open={open} onOpenChange={(newOpenState: boolean) => newOpenState && onClose && onClose()}>
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
        </Modal>
    );
}

export default ConfigurationDialog;
