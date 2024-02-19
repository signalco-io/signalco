'use client';

import { QueryList } from '@signalco/ui/QueryList';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { InAppCtaSignUp } from '../../shared/InAppCtaSignUp';
import { useDocuments } from '../../../src/hooks/useDocuments';
import { DocumentsListItem } from './DocumentsListItem';
import { DocumentCreateForm } from './DocumentCreateForm';

export function DocumentsList() {
    return (
        <>
            <SignedIn>
                <QueryList
                    query={useDocuments}
                    itemRender={(item) => (<DocumentsListItem document={item} />)}
                    editable
                    itemCreateLabel="New document"
                    createForm={<DocumentCreateForm redirect />}
                />
            </SignedIn>
            <SignedOut>
                <InAppCtaSignUp />
            </SignedOut>
        </>
    );
}
