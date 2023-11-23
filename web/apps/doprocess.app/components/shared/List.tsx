'use client';

import { Fragment, ReactElement, ReactNode, useState } from 'react';
import { type UseQueryResult } from '@tanstack/react-query';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal } from '@signalco/ui-primitives/Modal';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List as UIList } from '@signalco/ui-primitives/List';
import { Add } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { ListSkeleton } from './ListSkeleton';
import { ListItemCreate } from './ListItemCreate';

type ListProps<T> = {
    query: () => UseQueryResult<T[] | null | undefined, Error>;
    editable?: boolean;
    itemCreateLabel?: string;
    itemRender?: (item: T) => ReactElement;
    createForm?: ReactNode;
    emptyPlaceholder?: ReactNode;
};

export function List<T>({ query, itemRender, editable, itemCreateLabel, createForm, emptyPlaceholder }: ListProps<T>) {
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
                            <>
                                {emptyPlaceholder ? (
                                    emptyPlaceholder
                                ) : (
                                    <ListItem
                                        disabled
                                        className={'text-muted-foreground'}
                                        label="No items" />
                                )}
                            </>
                        )}
                    </>
                )}
            </UIList>
        </Loadable>
    );
}
