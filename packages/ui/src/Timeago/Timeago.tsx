import ReactTimeago from 'react-timeago';
import { Typography } from '@mui/joy';

export type TimeagoProps = {
    date: number | Date | undefined;
    live?: boolean;
};

export default function Timeago(props: TimeagoProps) {
    const { date, live } = props;

    const isNever = typeof date === 'number' || date == null;

    return (
        <div>
            {isNever
                ? <Typography level="body3">?</Typography>
                : <ReactTimeago date={date!} live={live} />}
        </div>
    )
}
