'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Progress } from '@signalco/ui-primitives/Progress';
import { cx } from '@signalco/ui-primitives/cx';

export function InsightsItem({ name, value, maxValue, unlimited }: { name: string; value: number | undefined; maxValue: number | undefined; unlimited: boolean | undefined; }) {
    const percentage = !unlimited && maxValue ? Math.ceil(((value ?? 0) / maxValue) * 100) : 100;

    return (
        <div>
            <Row justifyContent="space-between">
                {/* <Button variant="link" href="#messages" size="xs">Messages</Button> */}
                <Typography level="body1">{name}</Typography>
                <Row spacing={0.5}>
                    <Typography level="body2">{value}</Typography>
                    <Typography level="body3">/</Typography>
                    <Typography level="body2">{unlimited ? 'Unlimited' : maxValue}</Typography>
                    {!unlimited && <Typography level="body2">({percentage}%)</Typography>}
                </Row>
            </Row>
            <Progress value={percentage} className="h-2" trackClassName={cx(!unlimited && percentage >= 100 && 'bg-red-500')} />
        </div>
    );
}
