import { Box, Grid, Paper, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import DevicesLocalRepository from "../../src/devices/DevicesLocalRepository";
import Device, { IDeviceConfiguration } from "../devices/Device";

const HomeOverview = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const loadDevices = async () => {
            try {
                const availableDevices = await DevicesLocalRepository.getDevicesAsync();
                setDevices(availableDevices);
            } catch(error) {
                console.warn("Failed to load devices from Beacon");
            }
        }

        loadDevices();
    }, []);

    const renderDevice = (device: IDeviceConfiguration) => (
        <Grid item key={device.identifier}>
            <Device deviceConfiguration={device} />
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