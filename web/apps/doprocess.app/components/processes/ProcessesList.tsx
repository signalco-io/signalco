'use client';

import { useState } from 'react';
import { Add } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { Modal } from '@signalco/ui/dist/Modal';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { List } from '@signalco/ui/dist/List';
import { ListSkeleton } from '../shared/ListSkeleton';
import { ListItemCreate } from '../shared/ListItemCreate';
import { useProcesses } from '../../src/hooks/useProcesses';
import { ProcessesListItem } from './ProcessesListItem';
import { ProcessCreateForm } from './ProcessCreateForm';

export function ProcessesList() {
    const { data: processes, isLoading, error } = useProcesses();
    const [showCreateProcessModal, setShowCreateProcessModal] = useState(false);

    if (!error && !isLoading && !processes?.length) {
        return (
            <NoDataPlaceholder className="text-center">No processes. Start by creating new process.</NoDataPlaceholder>
        );
    }

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading processes..."
            placeholder={<ListSkeleton itemClassName="h-9" />}
            error={error}>
            <List className="divide-y rounded-lg border">
                {processes?.map((process) => (
                    <ProcessesListItem key={process.id} process={process} />
                ))}
                <ListItemCreate
                    label="Create new process"
                    onSelected={() => setShowCreateProcessModal(true)} />
                <Modal
                    open={showCreateProcessModal}
                    onOpenChange={setShowCreateProcessModal}>
                    <Stack spacing={4}>
                        <Row spacing={2}>
                            <Add />
                            <Typography level="h5">Create process</Typography>
                        </Row>
                        <ProcessCreateForm redirect />
                    </Stack>
                </Modal>
            </List>
        </Loadable>
    );
}
