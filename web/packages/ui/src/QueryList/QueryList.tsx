'use client';

import { Fragment, ReactElement, ReactNode, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal } from '@signalco/ui-primitives/Modal';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List as UIList } from '@signalco/ui-primitives/List';
import { Add } from '@signalco/ui-icons';
import { Loadable } from '../Loadable';
import { QueryListSkeleton } from './QueryListSkeleton';
import { QueryListItemCreate } from './QueryListItemCreate';

type QueryListPropsCommon<T> = {
    query: () => { data: T[] | null | undefined, error?: Error | null, isLoading: boolean };
    itemRender?: (item: T) => ReactElement;
    emptyPlaceholder?: ReactNode;
    className?: string;
    variant?: 'outlined' | 'plain';
}

type QueryListPropsEditable = {
    editable?: never;
    onEditing?: never,
    itemCreateLabel?: never;
    createForm?: never;
    createPosition?: never;
} | {
    editable: true | boolean;
    onEditing?: () => void,
    itemCreateLabel: string;
    createForm?: ReactNode;
    /**
     * @default 'bottom'
     */
    createPosition?: 'top' | 'bottom';
};

type QueryListProps<T> = QueryListPropsCommon<T> & QueryListPropsEditable;

function QueryListEmptyPlaceholder({ emptyPlaceholder }: { emptyPlaceholder?: ReactNode }) {
    return (
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
    );
}

export function QueryList<T>({
    query, itemRender, editable, onEditing, itemCreateLabel, createForm, emptyPlaceholder, variant,
    className,
    createPosition = 'bottom'
}: QueryListProps<T>) {
    const { data, isLoading, error } = query();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleEdit = () => {
        onEditing?.();
        if (createForm)
            setShowCreateModal(true);
    }

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading..."
            placeholder={<QueryListSkeleton className={className} itemClassName="h-9" />}
            error={error}>
            <UIList variant={variant} className={className}>
                {createPosition === 'top' && (
                    <QueryListItemCreate
                        label={itemCreateLabel}
                        onSelected={handleEdit}
                        variant="outlined" />
                )}
                {data?.map((item, i) => (
                    <Fragment key={i}>
                        {itemRender ? itemRender(item) : null}
                    </Fragment>
                ))}
                {editable && (
                    <>
                        {createPosition === 'bottom' && (
                            <QueryListItemCreate
                                label={itemCreateLabel}
                                onSelected={handleEdit}
                                variant="outlined" />
                        )}
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
                {!editable && !data?.length && (
                    <QueryListEmptyPlaceholder emptyPlaceholder={emptyPlaceholder} />
                )}
            </UIList>
        </Loadable>
    );
}
