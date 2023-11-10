import { Navigate, Text } from '@signalco/ui-icons';
import { ListItem } from '../../shared/ListItem';
import { KnownPages } from '../../../src/knownPages';
import { DocumentDto } from '../../../app/api/dtos/dtos';

export type DocumentsListItemProps = {
    document: DocumentDto
};

export function DocumentsListItem({ document }: DocumentsListItemProps) {
    return (
        <ListItem
            label={document.name}
            startDecorator={<Text />}
            endDecorator={<Navigate className="opacity-0 group-hover:opacity-100" />}
            className="group w-full"
            href={KnownPages.Document(document.id)} />
    );
}
