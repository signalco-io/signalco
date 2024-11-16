'use client';

import { ResponsiveContainer } from 'recharts';
import React from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { arraySum, objectWithKey } from '@signalco/js';
import Graph from '../../graphs/Graph';
import { now } from '../../../src/services/DateTimeProvider';
import useAllEntities from '../../../src/hooks/signalco/entity/useAllEntities';
import { LabeledValue } from './LabeledValue';

type Usage = {
    contactSet: number;
    conduct: number;
    process: number;
    other: number;
};

function sumUsage(u: Partial<Usage> | undefined) {
    return u ? (u.other ?? 0) + (u.contactSet ?? 0) + (u.conduct ?? 0) + (u.process ?? 0) : 0;
}

export function UsageCurrent() {
    const usersEntities = useAllEntities(6);
    const userEntity = usersEntities.data?.at(0);

    const limit = 2000;

    const nowDate = now();
    const daysInCurrentMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 0).getDate();
    const usages = [...new Array(daysInCurrentMonth).keys()].map(d => {
        const dayUsage = JSON.parse(
            (userEntity?.contacts.find((c: unknown) => objectWithKey(c, 'channelName')?.channelName === 'signalco' &&
                objectWithKey(c, 'channelName')?.contactName === `usage-${nowDate.getFullYear()}${(nowDate.getMonth() + 1).toString().padStart(2, '0')}${(d + 1).toString().padStart(2, '0')}`)
                ?.valueSerialized)
            ?? '{}');

        return {
            id: `${nowDate.getFullYear()}-${(nowDate.getMonth() + 1).toString().padStart(2, '0')}-${(d + 1).toString().padStart(2, '0')}`,
            value: {
                consuct: Number(objectWithKey(dayUsage, 'conduct')?.conduct) || 0,
                contactSet: Number(objectWithKey(dayUsage, 'contactSet')?.contactSet) || 0,
                process: Number(objectWithKey(dayUsage, 'process')?.process) || 0,
                other: Number(objectWithKey(dayUsage, 'other')?.other) || 0
            }
        };
    });

    // Last 5 days (including current)
    const calulatedUsageSlice = usages.slice(nowDate.getDate() - 5, nowDate.getDate());
    const usageTotal = arraySum(calulatedUsageSlice.map(s => s.value), sumUsage);

    const dailyCalculated = Math.round(usageTotal / calulatedUsageSlice.length);
    const monthlyCalculated = usageTotal + dailyCalculated * daysInCurrentMonth;

    const predictedUsage = usages.map((u, i) => {
        const isCurrent = i < nowDate.getDate();
        return isCurrent
            ? u
            : ({
                id: u.id,
                value: {
                    conduct: 0,
                    contactSet: 0,
                    process: 0,
                    other: dailyCalculated
                }
            });
    });

    return (
        <Stack spacing={2}>
            <Row spacing={4}>
                <LabeledValue label="Used Today" value={sumUsage(usages[nowDate.getDate() - 1]?.value)} />
                <LabeledValue label="Used This Month" value={usageTotal} />
                <Divider orientation="vertical" />
                <LabeledValue label="Calculated Daily" value={dailyCalculated} />
                <LabeledValue label="Calculated Monthly" value={monthlyCalculated} />
            </Row>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <Graph
                        data={predictedUsage}
                        durationMs={daysInCurrentMonth * 24 * 60 * 60 * 1000}
                        width={500}
                        height={300}
                        discrete
                        aggregate={1}
                        limits={[
                            { id: 'executions', value: limit }
                        ]} />
                </ResponsiveContainer>
            </div>
        </Stack>
    );
}
