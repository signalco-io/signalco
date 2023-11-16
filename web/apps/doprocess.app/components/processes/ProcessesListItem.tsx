import { ListChecks, Navigate } from '@signalco/ui-icons';
import { ListItem } from '../shared/ListItem';
import { KnownPages } from '../../src/knownPages';
import { ProcessDto } from '../../app/api/dtos/dtos';

export type ProcessListItemProps = {
    process: ProcessDto;
};

export function ProcessesListItem({ process }: ProcessListItemProps) {
    return (
        <ListItem
            label={process.name}
            startDecorator={<ListChecks />}
            endDecorator={<Navigate className="opacity-0 group-hover:opacity-100" />}
            className="group w-full"
            href={KnownPages.Process(process.id)} />
    );
}
