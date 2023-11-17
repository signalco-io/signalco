'use client';

import { List } from '../../shared/List';
import { useDocuments } from '../../../src/hooks/useDocuments';
import { DocumentsListItem } from './DocumentsListItem';
import { DocumentCreateForm } from './DocumentCreateForm';

export function DocumentsList() {
    return (
        <List
            query={useDocuments}
            itemRender={(item) => (<DocumentsListItem document={item} />)}
            editable
            itemCreateLabel="New document"
            createForm={<DocumentCreateForm redirect />}
        />
    );
}
