import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { ListHeader } from '../shared/ListHeader';
import { TypographyProcessName } from './TypographyProcessName';
import { RunsList } from './RunsList';

export function RunsListView({ processId }: { processId?: string }) {
    return (
        <Stack className="w-full p-2 pt-3" spacing={2}>
            <ListHeader header={(
                <>
                    {processId && <TypographyProcessName id={processId} level="h5" />}
                    <Typography level="h5">{processId ? 'runs' : 'Runs'}</Typography>
                </>
            )} />
            <RunsList processId={processId} />
        </Stack>
    );
}
