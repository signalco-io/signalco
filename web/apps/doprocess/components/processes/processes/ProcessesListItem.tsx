import { Row } from '@signalco/ui-primitives/Row';
import { ListTodo, Navigate } from '@signalco/ui-icons';
import { QueryListItem } from '@signalco/ui/QueryList';
import { SharedWithIndicator } from '../../shared/SharedWithIndicator';
import { KnownPages } from '../../../src/knownPages';
import { ProcessDto } from '../../../app/api/dtos/dtos';

export type ProcessListItemProps = {
    process: ProcessDto;
};

export function ProcessesListItem({ process }: ProcessListItemProps) {
    return (
        <QueryListItem
            label={process.name}
            startDecorator={<ListTodo />}
            endDecorator={(
                <Row spacing={1}>
                    <SharedWithIndicator shareableEntity={process} />
                    <Navigate className="hidden opacity-0 group-hover:opacity-100 md:block" />
                </Row>
            )}
            className="group w-full"
            href={KnownPages.Process(process.id)} />
    );
}
