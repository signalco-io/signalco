import { ListChecks, Navigate } from '@signalco/ui-icons';
import { ListItem } from '../shared/ListItem';
import { Process } from '../../src/lib/db/schema';
import { KnownPages } from '../../src/knownPages';

export type ProcessListItemProps = {
    process: Process
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
