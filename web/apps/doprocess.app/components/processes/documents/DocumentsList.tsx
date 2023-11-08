'use client';

import { List } from '../../shared/List';
import { useDocuments } from '../../../src/hooks/useDocuments';
import { DocumentsListItem } from './DocumentsListItem';

export function DocumentsList() {
    return (
        <List
            query={useDocuments}
            itemRender={(item) => (<DocumentsListItem document={item} />)}
        />
    );
}
