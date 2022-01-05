import { Box, Button, LinearProgress, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";
import DashboardsRepository, { IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import PageNotificationService from "../../src/notifications/PageNotificationService";
import DashboardsUpdateChecker from "./DashboardsUpdateChecker";
import DashboardView from "./DashboardView";
import DashboardSelector from "./DashboardSelector";
import DashboardSettings from "./DashboardSettings";
import { LoadingButton } from "@mui/lab";

const Dashboards = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [selectedId, setSelectedId] = React.useState<string | undefined>(undefined);
    const [selectedDashboard, setSelectedDashboard] = React.useState<IDashboardModel | undefined>(undefined);

    const [isDashboardSettingsOpen, setIsDashboardSettingsOpen] = useState<boolean>(false);

    useEffect(() => {
        const loadSelectedDashboard = async (id: string) => {
            setIsLoading(true);
            try {
                setSelectedDashboard(await DashboardsRepository.getAsync(id));
            } catch (err) {
                console.warn("Failed to load dashboard", err);
                PageNotificationService.show("Failed to load dashboard. Please try again.", "error");
            } finally {
                setIsLoading(false);
            }
        }

        if (selectedId) {
            console.debug("Switching to dashboard: ", selectedId);
            loadSelectedDashboard(selectedId);
        }
    }, [selectedId]);

    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const handleEditDone = async () => {
        try {
            setIsSavingEdit(true);
            const updatedDashboards = [];
            for (let i = 0; i < DashboardsRepository.dashboards.length; i++) {
                const dashboard = DashboardsRepository.dashboards[i];
                updatedDashboards.push({
                    ...dashboard,
                    configurationSerialized: JSON.stringify({
                        widgets: dashboard.widgets
                    })
                });
            }
            console.debug("Saving dashboards...", updatedDashboards);
            await DashboardsRepository.saveDashboardsAsync(updatedDashboards);
        } catch (err) {
            console.error('Failed to save dashboards', err);
            PageNotificationService.show('There was an error while saving dashboards. Please try again or refresh the page.', "error");
        } finally {
            setIsEditing(false);
            setIsSavingEdit(false);
        }
    };

    const handleAddWidget = async () => {

    };

    console.debug("Rendering Dashboards");

    return (
        <>
            <DashboardsUpdateChecker />
            <Stack spacing={{ xs: 1, sm: 2 }} sx={{ pt: { xs: 0, sm: 2 } }}>
                <Stack spacing={1} direction={{ xs: "column-reverse", md: "row" }} justifyContent="space-between" alignItems="stretch">
                    <DashboardSelector
                        onSelection={setSelectedId}
                        onEditWidgets={() => setIsEditing(true)}
                        onSettings={() => setIsDashboardSettingsOpen(true)} />
                    {isEditing && (
                        <Box sx={{ px: 2, width: { md: "auto", xs: '100%' } }}>
                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" size="large" onClick={handleAddWidget} sx={{ width: '250px' }}>Add widget...</Button>
                                <LoadingButton loading={isSavingEdit} variant="outlined" size="large" onClick={handleEditDone} fullWidth>Done editing</LoadingButton>
                            </Stack>
                        </Box>
                    )}
                </Stack>
                {isLoading ?
                    <LinearProgress /> : (
                        <Box sx={{ px: 2 }}>
                            {selectedDashboard ?
                                <DashboardView
                                    dashboard={selectedDashboard}
                                    isEditing={isEditing} />
                                : (
                                    <Box textAlign="center" sx={{ m: 2 }}>
                                        <NoDataPlaceholder content="No dashboards available" />
                                    </Box>
                                )}
                        </Box>
                    )}
            </Stack>
            <DashboardSettings
                dashboard={selectedDashboard}
                isOpen={isDashboardSettingsOpen}
                onClose={() => setIsDashboardSettingsOpen(false)} />
        </>
    );
};

export default observer(Dashboards);