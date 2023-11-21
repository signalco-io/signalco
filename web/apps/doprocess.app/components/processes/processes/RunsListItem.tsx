import { ListChecks, Navigate, Play } from '@signalco/ui-icons';
import { Row } from '@signalco/ui/Row';
import { ListItem } from '../../shared/ListItem';
import { KnownPages } from '../../../src/knownPages';
import { ProcessRunDto } from '../../../app/api/dtos/dtos';
import { TypographyProcessName } from './TypographyProcessName';
import { Stack } from '@signalco/ui/Stack';
import { Typography } from '@signalco/ui/Typography';

export type RunsListItemProps = {
    run: ProcessRunDto
};

export function RunsListItem({ run }: RunsListItemProps) {
    return (
        <ListItem
            label={(
                <Stack spacing={0.5}>
                    <Typography>{run.name}</Typography>
                    <Row spacing={1} className="opacity-60">
                        <ListChecks size={16} />
                        <TypographyProcessName id={run.processId.toString()} level="body3" />
                    </Row>
                </Stack>
            )}
            startDecorator={<Play />}
            endDecorator={(
                <Navigate className="opacity-0 group-hover:opacity-100" />
            )}
            className="group w-full"
            href={KnownPages.ProcessRun(run.processId, run.id)} />
    );
}
