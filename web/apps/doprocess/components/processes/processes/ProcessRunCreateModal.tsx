'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal } from '@signalco/ui-primitives/Modal';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Play } from '@signalco/ui-icons';
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
