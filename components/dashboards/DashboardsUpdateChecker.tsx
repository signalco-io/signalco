import { Alert, Box, Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";

const DashboardsUpdateChecker = () => {
    const handleApplyDashboardsUpdate = async () => {
        await DashboardsRepository.applyDashboardsUpdateAsync();
    };

    const checkDashboardUpdateAsync = async () => {
        try {
            await DashboardsRepository.isUpdateAvailableAsync();
        } catch (err) {
            console.warn("Failed to check dashboards update", err);
        }
    };

    useEffect(() => {
        // Set interval for checking dashboard updates (30min) or on refresh
        const token = setInterval(checkDashboardUpdateAsync, 30 * 60000);
        checkDashboardUpdateAsync();
        return () => clearInterval(token);
    }, []);

    if (!DashboardsRepository.isUpdateAvailable)
        return <></>;

    return (
        <Box pr={2} pl={{ mobile: 2, tablet: 0 }} pt={2}>
            <Alert
                severity="info"
                action={<Button variant="contained" size="small" onClick={handleApplyDashboardsUpdate}>Apply update</Button>}>
                New version of dashboards are available.
            </Alert>
        </Box>
    );
};

export default observer(DashboardsUpdateChecker);