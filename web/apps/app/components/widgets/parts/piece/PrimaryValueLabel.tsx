import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';

export function numberWholeAndDecimal(data: number | string | undefined): [undefined, undefined] | [number, number] {
    if (typeof data === 'undefined')
        return [undefined, undefined];

    const degrees = typeof data === 'string'
        ? Number.parseFloat(data)
        : data;
    const degreesWhole = Math.floor(degrees);
    return [
        degreesWhole,
        Math.floor((degrees - degreesWhole) * 10)
    ];
}

export function PrimaryValueLabel({ value, unit, size }: { value: number | string | undefined; unit: string; size: 'small' | 'large'; }) {
    const [degreesWhole, degreesDecimal] = numberWholeAndDecimal(value);
    return (
        <Row alignItems="stretch">
            <Stack className="h-full" justifyContent="center" alignItems="center">
                <Typography extraThin className={cx(size === 'large' ? 'text-6xl' : 'text-4xl')}>{degreesWhole}</Typography>
            </Stack>
            <Stack alignItems="start" justifyContent="space-between">
                <Typography extraThin className={size === 'large' ? 'text-lg' : 'text-xs'} tertiary>{unit}</Typography>
                <Typography extraThin className={size === 'large' ? 'text-lg' : 'text-sm'} tertiary>.{degreesDecimal}</Typography>
            </Stack>
        </Row>
    );
}
