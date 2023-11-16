'use client';

import { useState } from 'react';
import { cx } from 'classix';
import { Delete, MoreHorizontal } from '@signalco/ui-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Toolbar } from '../../shared/Toolbar';
import { SavingIndicator } from '../../shared/SavingIndicator';
import { KnownPages } from '../../../src/knownPages';
import { useDocument } from '../../../src/hooks/useDocument';
import { DocumentDeleteModal } from './DocumentDeleteModal';

type DocumentDetailsToolbarProps = {
    id: string;
    saving: boolean;
};

export function DocumentDetailsToolbar({ id, saving }: DocumentDetailsToolbarProps) {
    const { data: document } = useDocument(id);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    return (
        <>
            <Toolbar>
                <SavingIndicator saving={saving} />
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        className={cx('transition-opacity opacity-0', document && 'opacity-100')}>
                        <IconButton
                            variant="plain"
                            title="Document options...">
                            <MoreHorizontal />
                        </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteModalOpen(true)}>
                            Delete...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Toolbar>
            {document && (
                <DocumentDeleteModal
                    document={document}
                    open={deleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    redirect={KnownPages.Documents} />
            )}
        </>
    );
}
