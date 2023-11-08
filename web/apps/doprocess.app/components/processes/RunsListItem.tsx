import { Check, Navigate, Play } from '@signalco/ui-icons';
import { Row } from '@signalco/ui/dist/Row';
import { ListItem } from '../shared/ListItem';
import { ProcessRun } from '../../src/lib/db/schema';
import { KnownPages } from '../../src/knownPages';
import { TypographyProcessName } from './TypographyProcessName';

export type RunsListItemProps = {
    run: ProcessRun
};

export function RunsListItem({ run }: RunsListItemProps) {
    return (
        <ListItem
            label={run.name}
            startDecorator={<Play />}
            endDecorator={(
                <Row spacing={2}>
                    <Row spacing={1} className="opacity-60">
                        <Check />
                        <TypographyProcessName id={run.processId.toString()} />
                    </Row>
                    <Navigate className="opacity-0 group-hover:opacity-100" />
                </Row>
            )}
            className="group w-full"
            href={KnownPages.ProcessRun(run.processId, run.id)} />
    );
}
