import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';

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

export function PrimaryValueLabel({ value, unit, size = 'normal' }: { value: number | string | undefined; unit: string; size: 'small' | 'normal' | 'large'; }) {
    const [valueWhole, degreesDecimal] = numberWholeAndDecimal(value);
    const valueTextSize = (size === 'large' ? 'text-6xl' : (size === 'normal' ? 'text-5xl' : 'text-4xl'));
    const detailsTextSize = (size === 'large' ? 'text-lg' : (size === 'normal' ? 'text-base' : 'text-sm'));
    return (
        <Row alignItems="stretch">
            <Stack className="h-full" justifyContent="center" alignItems="center">
                <Typography extraThin className={valueTextSize}>{Number.isNaN(valueWhole) ? 0 : valueWhole}</Typography>
            </Stack>
            <Stack alignItems="start" justifyContent="space-between">
                <Typography extraThin className={detailsTextSize} tertiary>{unit ?? ''}</Typography>
                <Typography extraThin className={detailsTextSize} tertiary>.{Number.isNaN(degreesDecimal) ? 0 : degreesDecimal}</Typography>
            </Stack>
        </Row>
    );
}
