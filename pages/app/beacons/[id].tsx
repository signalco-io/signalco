import { Alert, Box, Button, Card, CardContent, CardHeader, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import AppLayout from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import BeaconsRepository, { IBeaconModel } from '../../../src/beacons/BeaconsRepository';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import compareVersions from 'compare-versions';

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

    const handleUpdate = async () => {
        try {
            if (id == null ||
                typeof id !== 'string')
                throw Error("Unable to resolve station id from query. Can't update");
            await BeaconsRepository.updateBeaconAsync(id);
        }
        catch (err) {
            console.error("Station update request failed", err);
        }
    };

    const canUpdate = (latestAvailableVersion && beacon?.version)
        ? compareVersions(latestAvailableVersion, beacon.version)
        : false;

    return (
        <Box sx={{ px: { sm: 2 }, py: 2 }}>
            <Grid container spacing={2} direction="column" wrap="nowrap">
                <Grid item>
                    <Typography variant="h1">{beacon?.id}</Typography>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item>
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
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

BeaconDetails.layout = AppLayout;

export default observer(BeaconDetails);
