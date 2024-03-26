import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { Card, CardContent, CardHeader, CardTitle } from '@signalco/ui-primitives/Card';

export function UsageCard({ header, children }: PropsWithChildren<{ header?: string; }>) {
    return (
        <Card className="bg-card/60">
            {header && (
                <CardHeader>
                    <CardTitle>
                        {header}
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent className={cx(!header && 'pt-6')}>
                <Stack spacing={3}>
                    {children}
                </Stack>
            </CardContent>
        </Card>
    );
}
