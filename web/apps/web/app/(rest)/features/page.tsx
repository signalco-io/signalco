import { Stack } from '@signalco/ui/dist/Stack';
import { Link } from '@signalco/ui/dist/Link';

export default function FeaturesPage() {
    return (
        <Stack spacing={1}>
            <Link href="/features/spaces">Spaces</Link>
            <Link href="/features/processes">Processes</Link>
        </Stack>
    );
}
