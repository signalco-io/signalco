'use client';

import { Fragment, ReactElement, ReactNode, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal } from '@signalco/ui-primitives/Modal';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List as UIList } from '@signalco/ui-primitives/List';
import { Add } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { QueryListSkeleton } from './QueryListSkeleton';
import { QueryListItemCreate } from './QueryListItemCreate';

type QueryListProps<T> = {
    query: () => { data: T[] | null | undefined, error?: Error | null, isLoading: boolean };
    editable?: boolean;
    itemCreateLabel?: string;
    itemRender?: (item: T) => ReactElement;
    createForm?: ReactNode;
    emptyPlaceholder?: ReactNode;
};

export function QueryList<T>({ query, itemRender, editable, itemCreateLabel, createForm, emptyPlaceholder }: QueryListProps<T>) {
    const { data, isLoading, error } = query();
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading..."
            placeholder={<QueryListSkeleton itemClassName="h-9" />}
            error={error}>
            <UIList className="divide-y rounded-lg border">
                {data?.map((item, i) => (
                    <Fragment key={i}>
                        {itemRender ? itemRender(item) : null}
                    </Fragment>
                ))}
                {editable ? (
                    <>
                        <QueryListItemCreate
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
