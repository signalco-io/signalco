import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { FileText, Navigate } from '@signalco/ui-icons';
import { SharedWithIndicator } from '../../shared/SharedWithIndicator';
import { KnownPages } from '../../../src/knownPages';
import { DocumentDto } from '../../../app/api/dtos/dtos';

export type DocumentsListItemProps = {
    document: DocumentDto
};

export function DocumentsListItem({ document }: DocumentsListItemProps) {
    return (
        <ListItem
            label={document.name}
            startDecorator={<FileText />}
            variant="outlined"
            endDecorator={(
                <Row spacing={1}>
                    <SharedWithIndicator shareableEntity={document} />
                    <Navigate className="hidden opacity-0 group-hover:opacity-100 md:block" />
                </Row>
            )}
            className="group w-full"
            href={KnownPages.Document(document.id)} />
    );
}
