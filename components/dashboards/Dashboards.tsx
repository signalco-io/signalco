import { Box, LinearProgress, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";
import DashboardsRepository, { IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import PageNotificationService from "../../src/notifications/PageNotificationService";
import DashboardsUpdateChecker from "./DashboardsUpdateChecker";
import DashboardView from "./DashboardView";
import DashboardSelector from "./DashboardSelector";
import DashboardSettings from "./DashboardSettings";

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

    const handleEditWidgets = () => {
        setIsEditing(true);
    };

    console.debug("Rendering Dashboards");

    return (
        <>
            <DashboardsUpdateChecker />
            <Stack spacing={{ mobile: 1, tablet: 4 }} sx={{ pt: { mobile: 0, tablet: 4 } }}>
                <div>
                    <DashboardSelector
                        onSelection={setSelectedId}
                        onEditWidgets={handleEditWidgets}
                        onSettings={() => setIsDashboardSettingsOpen(true)} />
                </div>
                {isLoading ?
                    <LinearProgress /> : (
                        <Box sx={{ px: { mobile: 2, tablet: 0 } }}>
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