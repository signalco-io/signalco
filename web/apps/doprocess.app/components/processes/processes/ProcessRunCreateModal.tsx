'use client';

import { Play } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/Typography';
import { Tooltip } from '@signalco/ui/Tooltip';
import { Stack } from '@signalco/ui/Stack';
import { Row } from '@signalco/ui/Row';
import { Modal } from '@signalco/ui/Modal';
import { IconButton } from '@signalco/ui/IconButton';
import { ProcessRunCreateForm } from './ProcessRunCreateForm';

type ProcessRunCreateModalProps = {
    processId: string;
};

export function ProcessRunCreateModal({ processId }: ProcessRunCreateModalProps) {
    return (
        <Modal trigger={(
            <Tooltip title="Run process">
                <IconButton variant="solid"><Play /></IconButton>
            </Tooltip>
        )}>
            <Stack spacing={4}>
                <Row spacing={2}>
                    <Play />
                    <Typography level="h5">Run process</Typography>
                </Row>
                <ProcessRunCreateForm processId={processId} redirect />
            </Stack>
        </Modal>
    );
}
