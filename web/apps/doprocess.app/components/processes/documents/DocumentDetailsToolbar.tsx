'use client';

import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Delete, Embed, MoreHorizontal } from '@signalco/ui-icons';
import { Toolbar } from '../../shared/Toolbar';
import { SavingIndicator } from '../../shared/SavingIndicator';
import { EmbedModal } from '../../shared/EmbedModal';
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
    const [embedOpen, setEmbedOpen] = useState(false);

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
                        <DropdownMenuItem startDecorator={<Embed />} onClick={() => setEmbedOpen(true)}>
                                    Embed...
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
            <EmbedModal
                header="Embed document"
                subHeader="To embed this process run, copy the following HTML snippet and paste it into your website:"
                src={`https://doprocess.app${KnownPages.Document(id)}/embedded`}
                open={embedOpen}
                onOpenChange={setEmbedOpen} />
        </>
    );
}
