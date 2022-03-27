import { Stack, Typography } from "@mui/material";
import React from "react";
import SignalcoLogotype from "../components/icons/SignalcoLogotype";
import { PageFullLayout } from "../components/layouts/PageFullLayout";

const OfflinePage = () => (
    <Stack
        sx={{
            my: '20vh'
        }}
        alignItems="center"
        spacing={4}
    >
        <div>
            <SignalcoLogotype priority width={230} />
        </div>
        <Typography variant="h1" fontWeight={300} color="textSecondary">You are offline...</Typography>
    </Stack>
);

OfflinePage.layout = PageFullLayout;

export default OfflinePage;