import ReactTimeago, { Suffix, type Unit } from 'react-timeago';
import { Typography } from '@signalco/ui-primitives/Typography';

export type TimeagoProps = {
    date: number | Date | undefined;
    live?: boolean;
    format?: 'default' | 'nano';
};

function nanoFormater(
    value: number,
    unit: Unit,
    suffix: Suffix,
) {
    return <span>{`${suffix === 'from now' ? '-' : ''}${value}${unit[0]}`}</span>;
}

export function Timeago({ date, live, format }: TimeagoProps) {
    const isNever = typeof date === 'number' || date == null;

    return (
        <div>
            {isNever
                ? <Typography level="body3">?</Typography>
                : <ReactTimeago formatter={format === 'nano' ? nanoFormater : undefined} date={date} live={live} />}
        </div>
    )
}
