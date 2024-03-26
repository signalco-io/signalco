import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { ListTodo, Navigate } from '@signalco/ui-icons';
import { SharedWithIndicator } from '../../shared/SharedWithIndicator';
import { KnownPages } from '../../../src/knownPages';
import { ProcessDto } from '../../../app/api/dtos/dtos';

export type ProcessListItemProps = {
    process: ProcessDto;
};

export function ProcessesListItem({ process }: ProcessListItemProps) {
    return (
        <ListItem
            label={process.name}
            startDecorator={<ListTodo />}
            endDecorator={(
                <Row spacing={1}>
                    <SharedWithIndicator shareableEntity={process} />
                    <Navigate className="hidden opacity-0 group-hover:opacity-100 md:block" />
                </Row>
            )}
            className="group w-full"
            href={KnownPages.Process(process.id)}
            variant="outlined" />
    );
}
