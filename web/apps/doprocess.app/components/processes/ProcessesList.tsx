'use client';

import { ReactElement, ReactNode, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { Add } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Modal } from '@signalco/ui/dist/Modal';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { List } from '@signalco/ui/dist/List';
import { ListSkeleton } from '../shared/ListSkeleton';
import { ListItemCreate } from '../shared/ListItemCreate';
import { useProcesses } from '../../src/hooks/useProcesses';
import { ProcessCreateForm } from './ProcessCreateForm';

type EntityListProps<T> = {
    query: () => UseQueryResult<T[] | undefined>;
    editable?: boolean;
    itemCreateLabel?: string;
    itemRender?: (item: T) => ReactElement;
    createForm?: ReactNode;
};

function EntityList<T>({ query, itemRender, editable, itemCreateLabel, createForm }: EntityListProps<T>) {
    const { data, isLoading, error } = query();
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading..."
            placeholder={<ListSkeleton itemClassName="h-9" />}
            error={error}>
            <List className="divide-y rounded-lg border">
                {data?.map((item) => (
                    <>
                        {itemRender ? itemRender(item) : null}
                    </>
                ))}
                {editable && (
                    <>
                        <ListItemCreate
                            label={itemCreateLabel}
                            onSelected={() => setShowCreateModal(true)} />
                        <Modal
                            open={showCreateModal}
                            onOpenChange={setShowCreateModal}>
                            <Stack spacing={4}>
                                <Row spacing={2}>
                                    <Add />
                                    <Typography level="h5">{itemCreateLabel}</Typography>
                                </Row>
                                {createForm}
                            </Stack>
                        </Modal>
                    </>
                )}
            </List>
        </Loadable>
    );
}

export function ProcessesList() {
    return (
        <EntityList
            query={useProcesses}
            editable
            itemCreateLabel="Create new process"
            createForm={<ProcessCreateForm redirect />} />
    );
}
