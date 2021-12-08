import { Alert, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";

const DashboardsUpdateChecker = (props: { onReload: () => void }) => {
    const [dashboardsUpdateAvailable, setDashboardsUpdateAvailable] = useState(false);

    const handleApplyDashboardsUpdate = async () => {
        setDashboardsUpdateAvailable(false);
        await DashboardsRepository.applyDashboardsUpdateAsync();
        props.onReload();
    };

    const checkDashboardUpdateAsync = async () => {
        try {
            setDashboardsUpdateAvailable(await DashboardsRepository.isUpdateAvailableAsync());
        } catch (err) {
            console.warn("Failed to check dashboards update", err);
        }
    };

    useEffect(() => {
        // Set interval for checking dashboard updates (30min)
        const token = setInterval(checkDashboardUpdateAsync, 30 * 60000);
        checkDashboardUpdateAsync();
        return () => clearInterval(token);
    }, []);

    if (!dashboardsUpdateAvailable)
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

export default DashboardsUpdateChecker;