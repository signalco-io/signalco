import React from 'react';
import {Typography} from '@signalco/ui-primitives/Typography';
import {Stack} from '@signalco/ui-primitives/Stack';
import style from './PageCenterHeader.module.scss';

export default function PageCenterHeader(props: { header: string; subHeader?: string; secondary?: boolean }) {
    const { header, subHeader, secondary } = props;
    return (
        <header className={style.root}>
            <Stack alignItems="center" spacing={2}>
                <Typography level={secondary ? 'h5' : 'h4'}>{header}</Typography>
                {subHeader && <Typography center>{subHeader}</Typography>}
            </Stack>
        </header>
    );
}
