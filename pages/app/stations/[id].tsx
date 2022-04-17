import { Alert, Box, Button, Card, CardContent, CardHeader, CardMedia, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react';
import ReactTimeago from 'react-timeago';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import { observer } from 'mobx-react-lite';
import StationsRepository, { IBlobInfoModel } from '../../../src/stations/StationsRepository';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import compareVersions from 'compare-versions';
import AutoTable from '../../../components/shared/table/AutoTable';
import useAutoTable from '../../../components/shared/table/useAutoTable';
import LoadingButton from '@mui/lab/LoadingButton';
import HttpService from '../../../src/services/HttpService';
import ConfirmDeleteButton from '../../../components/shared/dialog/ConfirmDeleteButton';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import useLocale, { localizer } from '../../../src/hooks/useLocale';
import { useLoadAndError } from '../../../src/hooks/useLoadingAndError';

const stationCommandAsync = async (stationId: string | string[] | undefined, command: (id: string) => Promise<void>, commandDescription: string) => {
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

async function loadLatestAvailableVersion() {
    try {
        return await (await fetch('https://api.github.com/repos/signalco-io/station/releases/latest')).json();
    }
    catch (err) {
        console.warn('Failed to retrieve latest available version', err);
        throw err;
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

    // Load station
    const { id } = router.query;
    const loadStationCallback = useCallback(() => loadStation(id?.toString()), [id]);
    const station = useLoadAndError(loadStationCallback);

    // Load latest available version
    const latestAvailableVersion = useLoadAndError(loadLatestAvailableVersion);
    const canUpdate = (!latestAvailableVersion.isLoading && !latestAvailableVersion.error && station.item?.version)
        ? compareVersions(latestAvailableVersion.item, station.item?.version)
        : false;

    // Station actions
    const handleUpdateSystem = () => stationCommandAsync(id, StationsRepository.updateSystemAsync, 'update system');
    const handleUpdate = () => stationCommandAsync(id, StationsRepository.updateStationAsync, 'update station');
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
    const workerServicesTable = useAutoTable(workerServicesTableLoadItems, workerServicesTableTransformItems);

    const [logContent, setLogContent] = useState('');
    const [loadingLog, setLoadingLog] = useState<string | undefined>(undefined);

    const logsAutoTableItemTransform = useCallback((i: IBlobInfoModel) => {
        var nameMatch = new RegExp(/.*\/(.*).txt/g).exec(i.name);
        return ({
            id: i.name,
            name: nameMatch ? nameMatch[1] : i.name,
            created: <ReactTimeago date={i.createdTimeStamp} />,
            modified: i.modifiedTimeStamp ? <ReactTimeago date={i.modifiedTimeStamp} /> : 'Never',
            size: i.size,
            actions: (
                <LoadingButton disabled={!!loadingLog && loadingLog !== i.name} loading={loadingLog === i.name} onClick={async () => {
                    if (station.item) {
                        try {
                            console.log(`Downloading ${i.name}...`);
                            setLoadingLog(i.name);
                            const response = await HttpService.getAsync(`/stations/logging/download?stationId=${station.item?.id}&blobName=${i.name}`) as { fileContents: string };
                            console.log(`Reading ${i.name}...`);
                            const contentBuffer = Buffer.from(response.fileContents, 'base64');
                            setLogContent(contentBuffer.toString('utf8'));
                            console.log(`Done ${i.name}...`);
                        }
                        finally {
                            setLoadingLog(undefined);
                        }
                    }
                }}>View</LoadingButton>
            )
        });
    }, [station, loadingLog]);
    const logsLoadItems = useCallback(() => Promise.resolve(station.item ? StationsRepository.getLogsAsync(station.item.id) : []), [station]);
    const logsTable = useAutoTable(logsLoadItems, logsAutoTableItemTransform);

    const handleDelete = async () => {
        if (!station.item) return;

        await StationsRepository.deleteAsync(station.item.id);
        router.push('/app/stations');
    };

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
                                                : <span>{t('Unknown')}</span>}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: 'end' }}>
                                        <Button startIcon={canUpdate ? <UploadIcon /> : <CheckIcon />} variant="outlined" disabled={!canUpdate} onClick={handleUpdate}>{canUpdate ? t('UpdateStationVersion', { version: latestAvailableVersion.item }) : t('UpdateStationUpToDate')}</Button>
                                    </Grid>
                                    <Grid item xs={4}><span>{t('LastActivity')}</span></Grid>
                                    <Grid item xs={8}>
                                        {station.item?.stateTimeStamp
                                            ? <ReactTimeago date={station.item.stateTimeStamp} />
                                            : <span>{t('Never')}</span>
                                        }
                                    </Grid>
                                    <Grid item xs={4}><span>{t('RegisteredDate')}</span></Grid>
                                    <Grid item xs={8}>
                                        {station.isLoading && <LinearProgress />}
                                        {station.error && <Alert color="error">Failed to load Station information: {station.error}</Alert>}
                                        {station.item?.registeredTimeStamp &&
                                            <ReactTimeago date={station.item.registeredTimeStamp} />
                                        }
                                    </Grid>
                                    <Grid item xs={4}><span>Station operations</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Button variant="outlined" onClick={handleRestartStation}>Restart station</Button>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}><span>System operations</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Button variant="outlined" onClick={handleUpdateSystem}>Update system</Button>
                                            <Button variant="outlined" onClick={handleRestartSystem}>Restart system</Button>
                                            <Button variant="outlined" onClick={handleShutdownSystem}>Shutdown system</Button>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}><span>Channels</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Button variant="outlined" onClick={handleBeginDiscovery}>Begin discovery</Button>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}><span>Advanced</span></Grid>
                                    <Grid item xs={8}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <ConfirmDeleteButton
                                                title="Delete station"
                                                buttonLabel="Delete..."
                                                expectedConfirmText={station.item?.id || 'confirm'}
                                                onConfirm={handleDelete} />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardHeader title="Channels" />
                            <CardMedia>
                                {station.isLoading ? 'Loading...' : (
                                    <AutoTable {...workerServicesTable} />
                                )}
                            </CardMedia>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={6}>
                        <Card>
                            <CardHeader title="Logs" />
                            <CardMedia>
                                {station.isLoading ? 'Loading...' : (
                                    <AutoTable {...logsTable} />
                                )}
                            </CardMedia>
                        </Card>
                    </Grid>
                    {logContent && (
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Log viewer" />
                                <CardMedia>
                                    <LogViewer text={logContent} height={500} />
                                </CardMedia>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Stack>
        </Box>
    );
}

interface ILogViewerProps {
    text: string;
    height: number;
}

interface ILogViewerLineProps {
    number: number;
    data: any;
    lineHeight: number;
}

const logLineRegex = new RegExp(/\[(.*)\]\s\((\w+)\)\s(.*)/);

const LogLevelBadge = ({ level }: { level: string }) => {
    let color = 'gray';
    switch (level) {
        case 'Information': color = 'DodgerBlue'; break;
        case 'Warning': color = 'DarkOrange'; break;
        case 'Fatal':
        case 'Error': color = 'DarkRed'; break;
    }

    return <span style={{ backgroundColor: color, padding: '2px', paddingLeft: '6px', paddingRight: '6px', borderRadius: 4, marginRight: '8px', fontSize: '10px', textTransform: 'uppercase' }}>{level.substring(0, 3)}</span>
};

const LogViewerLine = (props: ILogViewerLineProps) => {
    const { number, data, lineHeight } = props;
    const matches = logLineRegex.exec(data);
    const timeStamp = matches ? new Date(matches[1]) : new Date(0);
    return (
        <div style={{ top: `${number * lineHeight}px`, position: 'absolute' }}>
            <span style={{ paddingLeft: '8px', minWidth: '60px', display: 'inline-block' }}>{number}</span>
            {matches && <span style={{ marginRight: '8px' }}>{timeStamp.getUTCHours().toString().padStart(2, '0')}:{timeStamp.getUTCMinutes().toString().padStart(2, '0')}:{timeStamp.getUTCSeconds().toString().padStart(2, '0')}.{timeStamp.getMilliseconds().toString().padEnd(3, '0')}</span>}
            {matches && <LogLevelBadge level={matches[2]} />}
            <div style={{ opacity: 0.8, display: 'inline-block', height: '1.3rem' }}>{matches ? matches[3] : data}</div>
        </div>
    )
};

const LogViewer = (props: ILogViewerProps) => {
    const { text, height } = props;
    const lineHeight = 20.8;
    const overscan = 20;
    // const reverse = true;

    const [scrollPosition, setScrollPosition] = useState(0);

    const numberOfLinesInView = Math.ceil(height / lineHeight);

    const lines = text.split('\n');
    // if (reverse) lines.reverse();

    const linesCount = lines.length;

    // Calcualte view
    const firstVisibleLine = Math.floor(scrollPosition / lineHeight);
    const startLine = Math.max(firstVisibleLine - overscan, 0);
    const endLine = Math.min(firstVisibleLine + numberOfLinesInView + overscan, linesCount);
    const linesInView = lines.slice(startLine, endLine);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollPosition(e.currentTarget.scrollTop);
    };

    return (
        <div onScroll={handleScroll} style={{ position: 'relative', height: height, overflow: 'scroll', fontFamily: '"Monaco", monospace', fontSize: '12px', whiteSpace: 'pre' }}>
            <div style={{ height: `${linesCount * lineHeight}px` }}>
                {linesInView.map((lineText, i) => <LogViewerLine key={i} number={startLine + i} lineHeight={lineHeight} data={lineText} />)}
            </div>
        </div>
    );
};

StationDetails.layout = AppLayoutWithAuth;

export default observer(StationDetails);
