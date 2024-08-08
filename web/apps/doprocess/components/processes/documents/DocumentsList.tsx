'use client';

import { QueryList } from '@signalco/ui/QueryList';
import { SignedOut, SignedIn } from '@signalco/auth-client/components';
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
                    variant="outlined"
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
