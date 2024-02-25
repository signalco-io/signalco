import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { ListTodo, Navigate, Play } from '@signalco/ui-icons';
import { SharedWithIndicator } from '../../shared/SharedWithIndicator';
import { KnownPages } from '../../../src/knownPages';
import { useProcess } from '../../../src/hooks/useProcess';
import { ProcessRunDto } from '../../../app/api/dtos/dtos';
import { TypographyProcessName } from './TypographyProcessName';
import { RunProgress } from './RunProgress';

export type RunsListItemProps = {
    run: ProcessRunDto
};

export function RunsListItem({ run }: RunsListItemProps) {
    const process = useProcess(run.processId);

    return (
        <ListItem
            label={(
                <Stack spacing={0.5}>
                    <Typography>{run.name}</Typography>
                    <div className="flex flex-col gap-2 md:flex-row">
                        <Row spacing={1}>
                            <ListTodo size={16} className="opacity-80" />
                            <TypographyProcessName id={run.processId.toString()} level="body2" />
                        </Row>
                        {process.data && (
                            <SharedWithIndicator shareableEntity={process.data} />
                        )}
                    </div>
                </Stack>
            )}
            startDecorator={<Play />}
            endDecorator={(
                <Row spacing={1}>
                    <RunProgress processId={run.processId} runId={run.id} />
                    <Navigate className="hidden opacity-0 group-hover:opacity-100 md:block" />
                </Row>
            )}
            className="group w-full"
            href={KnownPages.ProcessRun(run.processId, run.id)}
            variant="outlined" />
    );
}
