import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Play } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../src/knownPages';
import { ViewEmptyPlaceholder } from './ViewEmptyPlaceholder';

export function RunsListEmptyPlaceholder({ showCompleted }: { showCompleted?: boolean }) {
    return (
        <ViewEmptyPlaceholder>
            <Play size={64} className="opacity-60" />
            <Stack spacing={2}>
                <Typography level="h4" secondary>No runs</Typography>
                {showCompleted ? (
                    <Typography secondary>You do not have any completed process runs.</Typography>
                ) : (
                    <Typography secondary>You do not have any process runs in progress. You can start by creating a process.</Typography>
                )}
            </Stack>
            <NavigatingButton href={KnownPages.Processes}>Processes</NavigatingButton>
        </ViewEmptyPlaceholder>
    );
}
