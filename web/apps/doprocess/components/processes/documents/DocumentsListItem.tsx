import { Row } from '@signalco/ui-primitives/Row';
import { FileText, Navigate } from '@signalco/ui-icons';
import { QueryListItem } from '@signalco/ui/QueryList';
import { SharedWithIndicator } from '../../shared/SharedWithIndicator';
import { KnownPages } from '../../../src/knownPages';
import { DocumentDto } from '../../../app/api/dtos/dtos';

export type DocumentsListItemProps = {
    document: DocumentDto
};

export function DocumentsListItem({ document }: DocumentsListItemProps) {
    return (
        <QueryListItem
            label={document.name}
            startDecorator={<FileText />}
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
