'use client';

import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Delete, Duplicate, Embed, Globe, MoreHorizontal } from '@signalco/ui-icons';
import { Toolbar } from '../../shared/Toolbar';
import { ShareModal } from '../../shared/ShareModal';
import { SavingIndicator } from '../../shared/SavingIndicator';
import { EmbedModal } from '../../shared/EmbedModal';
import { ShareableEntity } from '../../../src/types/ShareableEntity';
import { KnownPages } from '../../../src/knownPages';
import { useDocumentUpdate } from '../../../src/hooks/useDocumentUpdate';
import { useDocument } from '../../../src/hooks/useDocument';
import { DocumentDuplicateModal } from './DocumentDuplicateModal';
import { DocumentDeleteModal } from './DocumentDeleteModal';

type DocumentDetailsToolbarProps = {
    id: string;
    saving: boolean;
};

export function DocumentDetailsToolbar({ id, saving }: DocumentDetailsToolbarProps) {
    const { data: document } = useDocument(id);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [embedOpen, setEmbedOpen] = useState(false);
    const [sharePublicOpen, setSharePublicOpen] = useState(false);
    const [duplicateOpen, setDuplicateOpen] = useState(false);

    const isPublic = document && document.sharedWithUsers.includes('public');
    const documentUpdate = useDocumentUpdate();
    const handleShare = async (shareableEntity: ShareableEntity) => {
        await documentUpdate.mutateAsync({
            id,
            sharedWithUsers: shareableEntity.sharedWithUsers
        });
    };

    return (
        <>
            <Toolbar>
                <SavingIndicator saving={saving} />
                {document && (
                    <ShareModal
                        header={`Share ${document.name}`}
                        shareableEntity={document}
                        open={sharePublicOpen}
                        src={`https://doprocess.app${KnownPages.Document(id)}`}
                        hideTrigger={!isPublic}
                        onOpenChange={setSharePublicOpen}
                        onShareChange={handleShare} />
                )}
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
                        <DropdownMenuItem startDecorator={<Duplicate />} onClick={() => setDuplicateOpen(true)}>
                            Duplicate...
                        </DropdownMenuItem>
                        {!isPublic && (
                            <DropdownMenuItem startDecorator={<Globe />} onClick={() => setSharePublicOpen(true)}>
                                Make public...
                            </DropdownMenuItem>
                        )}
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
                    title="Delete document"
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
            {document && (
                <DocumentDuplicateModal
                    document={document}
                    open={duplicateOpen}
                    onOpenChange={setDuplicateOpen} />
            )}
        </>
    );
}
