import { Alert, Box, Button, Card, CardContent, CardHeader, CardMedia, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import { AppLayoutWithAuth } from "../../../components/AppLayoutWithAuth";
import { observer } from 'mobx-react-lite';
import BeaconsRepository, { IBeaconModel, IBlobInfoModel } from '../../../src/beacons/BeaconsRepository';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import compareVersions from 'compare-versions';
import AutoTable from '../../../components/shared/table/AutoTable';
import useAutoTable from '../../../components/shared/table/useAutoTable';
import LoadingButton from '@mui/lab/LoadingButton';
import HttpService from '../../../src/services/HttpService';
import ConfirmDeleteButton from '../../../components/shared/dialog/ConfirmDeleteButton';

const stationCommandAsync = async (stationId: string | string[] | undefined, command: (id: string) => Promise<void>, commandDescription: string) => {
    try {
        if (stationId == null ||
            typeof stationId !== 'string')
            throw Error("Station identifier not available. Can't " + commandDescription);

        await command(stationId);
    }
    catch (err) {
        console.error("Station command execution error", err);
    }
}

const BeaconDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [beacon, setBeacon] = useState<IBeaconModel | undefined>();
    const [latestAvailableVersion, setLatestAvailableVersion] = useState<string | undefined>();

    useEffect(() => {
        const loadBeaconAsync = async () => {
            try {
                if (typeof id !== "object" &&
                    typeof id !== 'undefined') {
                    const loadedBeacon = await BeaconsRepository.getBeaconAsync(id);
                    setBeacon(loadedBeacon);
                }
            } catch (err: any) {
                setError(err?.toString());
            } finally {
                setIsLoading(false);
            }
        };

        const loadLatestAvailableVersionAsync = async () => {
            try {
                const latestAvailable = await (await fetch("https://api.github.com/repos/signalco-io/station/releases/latest")).json();
                setLatestAvailableVersion(latestAvailable?.name?.replace("v", ""));
            }
            catch (err) {
                console.warn("Failed to retrieve latest available version", err);
            }
        };

        loadBeaconAsync();
        loadLatestAvailableVersionAsync();
    }, [id]);

    const handleUpdateSystem = () => stationCommandAsync(id, BeaconsRepository.updateSystemAsync, "update system");
    const handleUpdate = () => stationCommandAsync(id, BeaconsRepository.updateBeaconAsync, "update station");
    const handleRestartSystem = () => stationCommandAsync(id, BeaconsRepository.restartSystemAsync, "restart system");
    const handleShutdownSystem = () => stationCommandAsync(id, BeaconsRepository.shutdownSystemAsync, "shutdown system");
    const handleRestartStation = () => stationCommandAsync(id, BeaconsRepository.restartStationAsync, "restart station");
    const handleBeginDiscovery = () => stationCommandAsync(id, BeaconsRepository.beginDiscoveryAsync, "begin discovery");

    const canUpdate = (latestAvailableVersion && beacon?.version)
        ? compareVersions(latestAvailableVersion, beacon.version)
        : false;

    const workerServicesTableTransformItems = useCallback((i: string) => {
        const isRunning = (beacon?.runningWorkerServices?.findIndex(rws => rws === i) ?? -1) >= 0;
        const startStopAction = isRunning ? BeaconsRepository.stopWorkerServiceAsync : BeaconsRepository.startWorkerServiceAsync;
        const nameMatch = new RegExp(/(\w*\d*)\.(\w*\d*)\.(\w*\d*)\.(\w*\d*)\.*(\w*\d*)/g).exec(i);
        return (
            {
                id: i,
                name: nameMatch && nameMatch[5] ? nameMatch[4] : (nameMatch ? nameMatch[3] : i),
                running: isRunning ? "Running" : "Stopped",
                actions: (
                    <LoadingButton color={isRunning ? "error" : "success"} disabled={!beacon} onClick={() => beacon && startStopAction(beacon.id, i)}>{isRunning ? "Stop" : "Start"}</LoadingButton>
                )
            }
        );
    }, [beacon]);
    const workerServicesTableLoadItems = useCallback(() => Promise.resolve(beacon?.availableWorkerServices || []), [beacon])
    const workerServicesTable = useAutoTable(workerServicesTableLoadItems, workerServicesTableTransformItems);

    const [logContent, setLogContent] = useState('');
    const [loadingLog, setLoadingLog] = useState<string | undefined>(undefined);

    const logsAutoTableItemTransform = useCallback((i: IBlobInfoModel) => {
        var nameMatch = new RegExp(/.*\/(.*).txt/g).exec(i.name);
        return ({
            id: i.name,
            name: nameMatch ? nameMatch[1] : i.name,
            created: <ReactTimeago date={i.createdTimeStamp} />,
            modified: i.modifiedTimeStamp ? <ReactTimeago date={i.modifiedTimeStamp} /> : "Never",
            size: i.size,
            actions: (
                <LoadingButton disabled={!!loadingLog && loadingLog !== i.name} loading={loadingLog === i.name} onClick={async () => {
                    if (beacon) {
                        try {
                            console.log(`Downloading ${i.name}...`);
                            setLoadingLog(i.name);
                            const response = await HttpService.getAsync(`/stations/logging/download?stationId=${beacon.id}&blobName=${i.name}`) as { fileContents: string };
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
    }, [beacon, loadingLog]);
    const logsLoadItems = useCallback(() => Promise.resolve(beacon ? BeaconsRepository.getLogsAsync(beacon.id) : []), [beacon]);
    const logsTable = useAutoTable(logsLoadItems, logsAutoTableItemTransform);

    const handleDelete = async () => {
        if (!beacon) return;

        await BeaconsRepository.deleteAsync(beacon.id);
        router.push('/app/stations');
    };

    return (
        <Box sx={{ px: { sm: 2 }, py: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h1">{beacon?.id}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardHeader title="Information" />
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}><span>Version</span></Grid>
                                    <Grid item xs={4}>
                                        <Stack direction="row">
                                            {beacon?.version
                                                ? <span>{beacon.version}</span>
                                                : <span>Unknown</span>}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: 'end' }}>
                                        <Button startIcon={canUpdate ? <UploadIcon /> : <CheckIcon />} variant="outlined" disabled={!canUpdate} onClick={handleUpdate}>{canUpdate ? `Update to ${latestAvailableVersion}` : 'Up to date'}</Button>
                                    </Grid>
                                    <Grid item xs={4}><span>Last activity</span></Grid>
                                    <Grid item xs={8}>
                                        {beacon?.stateTimeStamp
                                            ? <ReactTimeago date={beacon?.stateTimeStamp} />
                                            : <span>Never</span>
                                        }
                                    </Grid>
                                    <Grid item xs={4}><span>Registered date</span></Grid>
                                    <Grid item xs={8}>
                                        {isLoading && <LinearProgress />}
                                        {error && <Alert color="error">Failed to load Beacon information: {error}</Alert>}
                                        {beacon?.registeredTimeStamp &&
                                            <ReactTimeago date={beacon?.registeredTimeStamp} />
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
                                                buttonLabel='Delete...'
                                                expectedConfirmText={beacon?.id || "confirm"}
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
                                {isLoading ? "Loading..." : (
                                    <AutoTable {...workerServicesTable} />
                                )}
                            </CardMedia>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={6}>
                        <Card>
                            <CardHeader title="Logs" />
                            <CardMedia>
                                {isLoading ? "Loading..." : (
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
    let color = "gray";
    switch (level) {
        case "Information": color = 'DodgerBlue'; break;
        case "Warning": color = 'DarkOrange'; break;
        case "Fatal":
        case "Error": color = 'DarkRed'; break;
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

BeaconDetails.layout = AppLayoutWithAuth;

export default observer(BeaconDetails);
