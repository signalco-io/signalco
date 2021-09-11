import { Box, Grid, Typography } from "@mui/material";
import React from "react";

const OfflinePage = (
    <Grid
        container
        className="login__root"
        wrap="nowrap"
        alignItems="center"
        direction="column"
    >
        <Grid item>
            <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item>
                    <Typography variant="h1">Signalco</Typography>
                </Grid>
                <Grid item>
                    <Box sx={{ width: 72, height: 72 }}></Box>
                </Grid>
            </Grid>
        </Grid>
        <Grid item>
            <Typography>You are offline</Typography>
        </Grid>
    </Grid>
);

export default OfflinePage;