import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal } from '@signalco/ui-primitives/Modal';

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
    children, header, headerActions, open, onClose, actions, trigger
}: IConfigurationDialogProps) {
    return (
        <Modal
            title={typeof header === 'string' ? header : 'Configuration'}
            trigger={trigger}
            open={open}
            onOpenChange={(newOpenState: boolean) => !newOpenState && onClose && onClose()}>
            <Stack spacing={2}>
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
