import { Alert, Box, Button, Card, CardContent, CardHeader, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import ReactTimeago from 'react-timeago';
import AppLayout from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import BeaconsRepository, { IBeaconModel } from '../../../src/beacons/BeaconsRepository';

const BeaconDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [beacon, setBeacon] = useState<IBeaconModel | undefined>();

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

        loadBeaconAsync();
    }, [id]);

    const handleUpdate = async () => {
        try {
            if (id == null)
                throw Error("Unable to resolve station id from query. Can't update");
            await BeaconsRepository.updateBeaconAsync(id);
        }
        catch (err) {
            console.error("Station update request failed", err);
        }
    };

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
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}><span>Version</span></Grid>
                                        <Grid item xs={8}>
                                            <Stack direction="row">
                                                {beacon?.version
                                                    ? <span>{beacon.version}</span>
                                                    : <span>Unknown</span>}
                                                <Button variant="outlined" disabled={!beacon?.version} onClick={handleUpdate}>Update</Button>
                                            </Stack>
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
