import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Card, CardContent, CardHeader, CardTitle } from '@signalco/ui-primitives/Card';

export function SettingsCard({ header, children }: PropsWithChildren<{ header: string; }>) {
    return (
        <Card className="bg-card/60">
            <CardHeader>
                <CardTitle>
                    {header}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Stack spacing={3}>
                    {children}
                </Stack>
            </CardContent>
        </Card>
    );
}
