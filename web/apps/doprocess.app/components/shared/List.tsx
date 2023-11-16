'use client';

import { Fragment, ReactElement, ReactNode, useState } from 'react';
import { type UseQueryResult } from '@tanstack/react-query';
import { Add } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Modal } from '@signalco/ui/dist/Modal';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { List as UIList } from '@signalco/ui/dist/List';
import { ListSkeleton } from './ListSkeleton';
import { ListItemCreate } from './ListItemCreate';

type ListProps<T> = {
    query: () => UseQueryResult<T[] | null | undefined, Error>;
    editable?: boolean;
    itemCreateLabel?: string;
    itemRender?: (item: T) => ReactElement;
    createForm?: ReactNode;
};

export function List<T>({ query, itemRender, editable, itemCreateLabel, createForm }: ListProps<T>) {
    const { data, isLoading, error } = query();
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading..."
            placeholder={<ListSkeleton itemClassName="h-9" />}
            error={error}>
            <UIList className="divide-y rounded-lg border">
                {data?.map((item, i) => (
                    <Fragment key={i}>
                        {itemRender ? itemRender(item) : null}
                    </Fragment>
                ))}
                {editable ? (
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
                ) : (
                    <>
                        {!data?.length && (
                            <ListItem
                                disabled
                                className={'text-muted-foreground'}
                                label="No items" />
                        )}
                    </>
                )}
            </UIList>
        </Loadable>
    );
}
