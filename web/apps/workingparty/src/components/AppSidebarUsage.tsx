import Link from 'next/link';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Progress } from '@signalco/ui-primitives/Progress';
import { Button } from '@signalco/ui-primitives/Button';
import { KnownPages } from '../knownPages';

export function AppSidebarUsage() {
    return (
        <Stack spacing={2} className="p-2">
            <Link href={KnownPages.AppSettingsAccountUsage}>
                <Stack spacing={1}>
                    <Row justifyContent="space-between">
                        <Typography level="body2" tertiary semiBold>Usage</Typography>
                        <Typography level="body2" tertiary>10%</Typography>
                    </Row>
                    <Progress value={10} className="h-2" trackClassName="bg-zinc-600" />
                </Stack>
            </Link>
            <Button href={KnownPages.AppSettingsAccountBilling} fullWidth>Upgrade</Button>
        </Stack>
    );
}
