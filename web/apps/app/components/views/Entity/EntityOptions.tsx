'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { MoreHorizontal } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import ConfirmDeleteDialog from '../../shared/dialog/ConfirmDeleteDialog';
import { KnownPages } from '../../../src/knownPages';
import useLocale from '../../../src/hooks/useLocale';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import useDeleteEntity from '../../../src/hooks/signalco/entity/useDeleteEntity';

export interface EntityOptionsProps {
    id: string | undefined;
}

export default function EntityOptions({ id, ...rest }: EntityOptionsProps) {
    const { t } = useLocale('App', 'Entities');
    const router = useRouter();
    const [showRawParam, setShowRawParam] = useSearchParam<string>('raw', 'false');
    const showRaw = showRawParam === 'true';
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { data: entity } = useEntity(id);
    const deleteEntity = useDeleteEntity();

    const handleDelete = () => {
        setIsDeleteOpen(true);
    };

    const handleShowRaw = () => {
        setShowRawParam(!showRaw ? 'true' : undefined);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (typeof id === 'undefined')
                throw new Error('Entity identifier not present.');

            await deleteEntity.mutateAsync(id);
            router.push(KnownPages.Entities);
        } catch (err) {
            console.error('Failed to delete entity', err);
            showNotification(t('DeleteErrorUnknown'));
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="plain" {...rest}>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={handleShowRaw}>{showRaw ? 'Hide details' : 'Show details'}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleDelete}>{t('DeleteButtonLabel')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDeleteDialog
                expectedConfirmText={entity?.alias || t('ConfirmDialogExpectedText')}
                header={t('DeleteTitle')}
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm} />
        </>
    );
}
