import { Box, Button, Card, CardContent, CardHeader, CardMedia, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useCallback } from 'react';
import { AppLayoutWithAuth } from '../../../../components/layouts/AppLayoutWithAuth';
import { observer } from 'mobx-react-lite';
import StationsRepository from '../../../../src/stations/StationsRepository';
import AutoTable from '../../../../components/shared/table/AutoTable';
import useAutoTable from '../../../../components/shared/table/useAutoTable';
import LoadingButton from '@mui/lab/LoadingButton';
import ConfirmDeleteButton from '../../../../components/shared/dialog/ConfirmDeleteButton';
import PageNotificationService from '../../../../src/notifications/PageNotificationService';
import useLocale, { localizer, useLocalePlaceholders } from '../../../../src/hooks/useLocale';
import { useLoadAndError } from '../../../../src/hooks/useLoadingAndError';
import LoadableText from '../../../../components/shared/Loadable/LoadableText';
import Loadable from '../../../../components/shared/Loadable/Loadable';
import StationCheckUpdate from '../../../../components/station/StationCheckUpdate';
import Timeago from '../../../../components/shared/time/Timeago';

export const stationCommandAsync = async (stationId: string | string[] | undefined, command: (id: string) => Promise<void>, commandDescription: string) => {
    try {
        if (stationId == null ||
            typeof stationId !== 'string')
            throw Error('Station identifier not available. Can\'t ' + commandDescription);

        await command(stationId);
    }
    catch (err) {
        console.error('Station command execution error', err);
        PageNotificationService.show(localizer('App', 'Stations')('StationCommandError'), 'error');
    }
}

async function loadStation(id: string | undefined) {
    if (typeof id !== 'object' &&
        typeof id !== 'undefined') {
        return await StationsRepository.getStationAsync(id);
    }
};

const StationDetails = () => {
    const router = useRouter();

    const { t } = useLocale('App', 'Stations');
    const { t: tPlaceholders } = useLocalePlaceholders();

    // Load station
    const { id } = router.query;
    const loadStationCallback = useCallback(() => loadStation(id?.toString()), [id]);
    const station = useLoadAndError(loadStationCallback);

    // Station actions
    const handleUpdateSystem = () => stationCommandAsync(id, StationsRepository.updateSystemAsync, 'update system');
    const handleRestartSystem = () => stationCommandAsync(id, StationsRepository.restartSystemAsync, 'restart system');
    const handleShutdownSystem = () => stationCommandAsync(id, StationsRepository.shutdownSystemAsync, 'shutdown system');
    const handleRestartStation = () => stationCommandAsync(id, StationsRepository.restartStationAsync, 'restart station');
    const handleBeginDiscovery = () => stationCommandAsync(id, StationsRepository.beginDiscoveryAsync, 'begin discovery');

    const workerServicesTableTransformItems = useCallback((i: string) => {
        const isRunning = (station.item?.runningWorkerServices?.findIndex(rws => rws === i) ?? -1) >= 0;
        const startStopAction = isRunning ? StationsRepository.stopWorkerServiceAsync : StationsRepository.startWorkerServiceAsync;
        const nameMatch = new RegExp(/(\w*\d*)\.(\w*\d*)\.(\w*\d*)\.(\w*\d*)\.*(\w*\d*)/g).exec(i);
        return (
            {
                id: i,
                name: nameMatch && nameMatch[5] ? nameMatch[4] : (nameMatch ? nameMatch[3] : i),
                running: isRunning ? t('Running') : t('Stopped'),
                actions: (
                    <LoadingButton color={isRunning ? 'error' : 'success'} disabled={!station} onClick={() => station.item && startStopAction(station.item.id, i)}>{isRunning ? t('Stop') : t('Start')}</LoadingButton>
                )
            }
        );
    }, [station, t]);
    const workerServicesTableLoadItems = useCallback(() => Promise.resolve(station.item?.availableWorkerServices || []), [station])
    const workerServicesTable = useAutoTable(workerServicesTableLoadItems, workerServicesTableTransformItems, t);

    const handleDelete = async () => {
        if (!station.item) return;

        await StationsRepository.deleteAsync(station.item.id);
        router.push('/app/stations');
    };

    console.debug('Page Station Details');

    return (
        <Box sx={{ px: { sm: 2 }, py: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h1">{station.item?.id}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardHeader title={t('Information')} />
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}><span>{t('Version')}</span></Grid>
                                    <Grid item xs={4}>
                                        <Stack direction="row">
                                            {station.item?.version
                                                ? <span>{station.item.version}</span>
                                                : <span>{tPlaceholders('Unknown')}</span>}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: 'end' }}>
                                        <StationCheckUpdate stationId={id} stationVersion={station.item?.version} />
                                    </Grid>
                                    <Grid item xs={4}><span>{t('LastActivity')}</span></Grid>
                                    <Grid item xs={8}>
                                        <Timeago date={station.item?.stateTimeStamp} />
                                    </Grid>
                                    <Grid item xs={4}><span>{t('RegisteredDate')}</span></Grid>
                                    <Grid item xs={8}>
                                        <LoadableText isLoading={station.isLoading} error={station.error}>
                                            <Timeago date={station.item?.registeredTimeStamp} />
                                        </LoadableText>
                                    </Grid>
                                    <Grid item xs={4}><span>{t('StationOperations')}</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Button variant="outlined" onClick={handleRestartStation}>{t('RestartStation')}</Button>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}><span>{t('SystemOperations')}</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Button variant="outlined" onClick={handleUpdateSystem}>{t('UpdateSystem')}</Button>
                                            <Button variant="outlined" onClick={handleRestartSystem}>{t('RestartSystem')}</Button>
                                            <Button variant="outlined" onClick={handleShutdownSystem}>{t('ShutdownSystem')}</Button>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}><span>{t('Channels')}</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Button variant="outlined" onClick={handleBeginDiscovery}>{t('BeginDiscovery')}</Button>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}><span>{t('Advanced')}</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <ConfirmDeleteButton
                                                title={t('DeleteStation')}
                                                buttonLabel={t('DeleteStationLabel')}
                                                expectedConfirmText={station.item?.id || t('ConfirmDialogExpectedText')}
                                                onConfirm={handleDelete} />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardHeader title={t('Channels')} />
                            <CardMedia>
                                <Loadable isLoading={station.isLoading} error={station.error} placeholder="linear">
                                    <AutoTable {...workerServicesTable} />
                                </Loadable>
                            </CardMedia>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}

StationDetails.layout = AppLayoutWithAuth;

export default observer(StationDetails);
