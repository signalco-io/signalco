import ReactTimeago, { Suffix, type Unit } from 'react-timeago';
import { Typography } from '@signalco/ui-primitives/Typography';

export type TimeagoProps = {
    date: number | Date | undefined;
    live?: boolean;
    format?: 'default' | 'nano';
    /**
     * The placeholder to display when the date is undefined.
     * @default '-'
     */
    noDate?: string;
};

function nanoFormater(
    value: number,
    unit: Unit,
    suffix: Suffix,
) {
    return <span>{`${suffix === 'from now' ? '-' : ''}${value}${unit[0]}`}</span>;
}

export function Timeago({ date, live, format, noDate = '-' }: TimeagoProps) {
    if ((typeof date !== 'number' && !((date as unknown) instanceof Date)) || date == null) {
        return (
            <Typography level="body2">{noDate}</Typography>
        );
    }

    return (
        <ReactTimeago
            title={(typeof date === 'number' ? new Date(date) : date)?.toLocaleString()}
            formatter={format === 'nano' ? nanoFormater : undefined}
            date={date}
            live={live} />
    );
}
