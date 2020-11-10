import { Box, Grid, Paper, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import DevicesLocalRepository from "../../src/devices/DevicesLocalRepository";
import Device from "../devices/Device";

const HomeOverview = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const loadDevices = async () => {
            const availableDevices = await DevicesLocalRepository.getDevicesAsync();
            setDevices(availableDevices);
        }

        loadDevices();
    }, []);

    const renderDevice = (device) => (
        <Grid item>
            <Paper key={device.identifier}>
                <Device deviceConfiguration={device} />
            </Paper>
        </Grid>
    );

    return (
        <div>
            <Grid container spacing={1}>
                {devices.map(d => renderDevice(d))}
            </Grid>
            <br />
            <Paper>
                <Box p={2}>
                <Typography variant="h4">Room</Typography>
                </Box>
                <Device inline />
                <Device inline />
                <Device inline />
            </Paper>
        </div>
    );
};

export default HomeOverview;