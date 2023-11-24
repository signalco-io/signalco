import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { ListChecks, Navigate, Play } from '@signalco/ui-icons';
import { ListItem } from '../../shared/ListItem';
import { KnownPages } from '../../../src/knownPages';
import { ProcessRunDto } from '../../../app/api/dtos/dtos';
import { TypographyProcessName } from './TypographyProcessName';
import { RunProgress } from './RunProgress';

export type RunsListItemProps = {
    run: ProcessRunDto
};

export function RunsListItem({ run }: RunsListItemProps) {
    return (
        <ListItem
            label={(
                <Stack spacing={0.5}>
                    <Typography>{run.name}</Typography>
                    <Row spacing={1} className="opacity-70">
                        <ListChecks size={16} />
                        <TypographyProcessName id={run.processId.toString()} level="body3" />
                    </Row>
                </Stack>
            )}
            startDecorator={<Play />}
            endDecorator={(
                <Row spacing={1}>
                    <RunProgress processId={run.processId} runId={run.id} />
                    <Navigate className="opacity-0 group-hover:opacity-100" />
                </Row>
            )}
            className="group w-full"
            href={KnownPages.ProcessRun(run.processId, run.id)} />
    );
}
