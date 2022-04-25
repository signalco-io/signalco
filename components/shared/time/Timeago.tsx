import React from 'react';
import ReactTimeago from 'react-timeago';
import useLocale from '../../../src/hooks/useLocale';

export default function Timeago(props: { date: number | Date | undefined, live?: boolean }) {
    const { t } = useLocale('App', 'Components', 'Timeago')

    return (
        <div>{typeof props.date === 'number' || props.date == null ? t('Never') : <ReactTimeago date={props.date} />}</div>
    )
}
