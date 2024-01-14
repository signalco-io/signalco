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
    const isNever = typeof date === 'number' || date == null;

    return (
        <div>
            {isNever
                ? <Typography level="body2">{noDate}</Typography>
                : <ReactTimeago formatter={format === 'nano' ? nanoFormater : undefined} date={date} live={live} />}
        </div>
    )
}
