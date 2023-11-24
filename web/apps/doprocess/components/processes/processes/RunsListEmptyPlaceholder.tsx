import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Play } from '@signalco/ui-icons';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../src/knownPages';

export function RunsListEmptyPlaceholder() {
    return (
        <Stack spacing={4} alignItems="center" className="px-4 py-12 text-center sm:py-24 md:py-40 lg:py-60">
            <Play size={64} className="opacity-60" />
            <Stack spacing={2}>
                <Typography level="h4" secondary>No runs</Typography>
                <Typography secondary>You do not have any process runs yet. You can start by creating a process.</Typography>
            </Stack>
            <NavigatingButton href={KnownPages.Processes}>Processes</NavigatingButton>
        </Stack>
    );
}
