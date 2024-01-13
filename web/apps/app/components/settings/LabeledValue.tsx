import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { humanizeNumber } from '@signalco/js';

export function LabeledValue({ value, unit, label }: { value: string | number; unit?: string; label: string; }) {
    return (
        <Stack>
            <Typography level="body2">{label}</Typography>
            <Row alignItems="end" spacing={1}>
                <Typography level="h5" component="span">
                    {typeof value === 'number' ? humanizeNumber(value) : value}
                </Typography>
                {!!unit && <Typography level="body3">{unit}</Typography>}
            </Row>
        </Stack>
    );
}
