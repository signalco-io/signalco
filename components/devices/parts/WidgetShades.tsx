import { ArrowUpward, Stop, ArrowDownward } from '@mui/icons-material';
import { Button, Grid, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import WidgetCard from './WidgetCard';
import { IWidgetConfigurationOption } from './WidgetConfiguration';

const WindowVisual = dynamic(() => import('../../icons/WindowVisual'));

const WidgetShades = (props: { config: any, setConfig: (config: object) => Promise<void> }) => {
    const [config, setConfig] = useState({});

    const width = (config as any)?.columns || 2;
    const height = (config as any)?.rows || 2;
    const label = props.config?.label || '';

    // TODO: Calc from source value
    const shadePerc = 0.3;

    const state = shadePerc < 1;

    const needsConfiguration = true;
    const isEditMode = false;
    const stateOptions: IWidgetConfigurationOption[] = [];

    useEffect(() => {
        console.log(config);
        if (props.config?.columns === undefined) {
            props.setConfig({
                columns: 4,
                rows: 2
            });
        }
    });

    return (
        <WidgetCard
            width={width}
            height={height}
            state={state}
            needsConfiguration={needsConfiguration}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            options={stateOptions}
            config={config}>
            <Grid container wrap="nowrap" sx={{ height: '100%' }}>
                <Grid item xs={6}>
                    <Stack sx={{ height: '100%', pl: 2.5, pr: 1.5, py: 2 }} justifyContent="space-between">
                        <WindowVisual shadePerc={shadePerc} theme="dark" size={68} />
                        <Typography fontWeight="light">{label}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6} sx={{ background: '#121212', borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
                    <Stack sx={{ height: '100%' }} justifyContent="stretch">
                        <Button sx={{ flexGrow: 1, borderBottom: '1px solid rgba(255,255,255,0.12)' }}><ArrowUpward /></Button>
                        <Button sx={{ flexGrow: 1 }}><Stop /></Button>
                        <Button sx={{ flexGrow: 1, borderTop: '1px solid rgba(255,255,255,0.12)' }}><ArrowDownward /></Button>
                    </Stack>
                </Grid>
            </Grid>
        </WidgetCard>
    );
};

WidgetShades.columns = 4;

export default WidgetShades;