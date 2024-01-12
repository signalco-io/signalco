import Link from 'next/link'
import { Typography } from '@signalco/ui-primitives/Typography'
import { Stack } from '@signalco/ui-primitives/Stack'
import { KnownPages } from '../src/knownPages'

export default function NotFound() {
    return (
        <Stack spacing={1}>
            <Typography level="h2">Not Found</Typography>
            <Typography>Could not find requested resource</Typography>
            <Link href={KnownPages.Landing}>Return Home</Link>
        </Stack>
    )
}
