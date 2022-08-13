import { Badge, Stack, Typography } from '@mui/material';
import React from 'react';
import ReactTimeago from 'react-timeago';
import { useLocalePlaceholders } from '../../../src/hooks/useLocale';
import DotIndicator from '../indicators/DotIndicator';

export default function Timeago(props: { date: number | Date | undefined, live?: boolean, error?: boolean }) {
    const { t } = useLocalePlaceholders();
    const { date, live, error } = props;

    const isNever = typeof date === 'number' || date == null;
    const isOld = isNever || new Date().getTime() - ((typeof date === 'number' ? (date ?? 0) : date?.getTime()) ?? 0) > 86400000;
    let color: 'success' | 'error' | 'warning' = 'success';
    if (error) color = 'error';
    else if (isOld) color = 'warning';

    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <DotIndicator color={color} />
            {isNever
                ? <Typography>{t('Never')}</Typography>
                : <ReactTimeago date={date!} live={live} />}
        </Stack>
    )
}
