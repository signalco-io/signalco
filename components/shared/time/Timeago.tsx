import { Typography } from '@mui/material';
import React from 'react';
import ReactTimeago from 'react-timeago';
import { useLocalePlaceholders } from '../../../src/hooks/useLocale';

export default function Timeago(props: { date: number | Date | undefined, live?: boolean }) {
    const { t } = useLocalePlaceholders();
    const { date, live } = props;

    const isNever = typeof date === 'number' || date == null;

    return (
        <div>
            {isNever
                ? <Typography variant="subtitle2">{t('Never')}</Typography>
                : <ReactTimeago date={date!} live={live} />}
        </div>
    )
}
