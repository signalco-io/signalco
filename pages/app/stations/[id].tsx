import { Alert, Box, Button, Card, CardContent, CardHeader, CardMedia, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import BeaconsRepository, { IBeaconModel } from '../../../src/beacons/BeaconsRepository';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import compareVersions from 'compare-versions';
import AutoTable from '../../../components/shared/table/AutoTable';
import useAutoTable from '../../../components/shared/table/useAutoTable';
import LoadingButton from '@mui/lab/LoadingButton';

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
        return (
            {
                id: i,
                name: i,
                running: isRunning ? "Running" : "Stopped",
                actions: (
                    <LoadingButton color={isRunning ? "error" : "success"} disabled={!beacon} onClick={() => beacon && startStopAction(beacon.id, i)}>{isRunning ? "Stop" : "Start"}</LoadingButton>
                )
            }
        );
    }, [beacon]);
    const workerServicesTableLoadItems = useCallback(() => Promise.resolve(beacon?.availableWorkerServices || []), [beacon])
    const workerServicesTable = useAutoTable(workerServicesTableLoadItems, workerServicesTableTransformItems);

    return (
        <Box sx={{ px: { sm: 2 }, py: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h1">{beacon?.id}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
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
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardHeader title="Channels" />
                            <CardMedia>
                                {isLoading ? "Loading..." : (
                                    <AutoTable {...workerServicesTable} />
                                )}
                            </CardMedia>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}

BeaconDetails.layout = AppLayoutWithAuth;

export default observer(BeaconDetails);
