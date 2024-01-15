import React from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { LabeledValue } from './LabeledValue';

export function UsagePlan() {
    return (
        <Row spacing={4} alignItems="start">
            <LabeledValue label="Plan" value="Free" />
            <Stack spacing={2}>
                <LabeledValue label="Executions limit" value={2000} unit="/month" />
            </Stack>
        </Row>
    );
}
