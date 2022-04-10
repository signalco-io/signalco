import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import DashboardsRepository, { WidgetModel } from "../../src/dashboards/DashboardsRepository";
import PageNotificationService from "../../src/notifications/PageNotificationService";
import DashboardsUpdateChecker from "./DashboardsUpdateChecker";
import DashboardView from "./DashboardView";
import DashboardSelector from "./DashboardSelector";
import DashboardSettings from "./DashboardSettings";
import { LoadingButton } from "@mui/lab";
import { widgetType } from "../widgets/Widget";
import ConfigurationDialog from "../shared/dialog/ConfigurationDialog";
import dynamic from "next/dynamic";
import { useLoadAndError } from "../../src/hooks/useLoadingAndError";
import Image from "next/image";
import useHashParam from "../../src/hooks/useHashParam";

const WidgetStoreDynamic = dynamic(() => import("../widgets/WidgetStore"));

const Dashboards = () => {
    const [selectedId, setSelectedId] = React.useState<string | undefined>(undefined);
    const retrieveDashbaord = useCallback(() => {
        console.log('revalidated current dashboard retrieve function')
        return DashboardsRepository.getAsync(selectedId);
    }, [selectedId]);
    const selectedDashboard = useLoadAndError(retrieveDashbaord);

    const [isDashboardSettingsOpen, setIsDashboardSettingsOpen] = useState<boolean>(false);

    const [isEditing, setIsEditing] = useState(false);
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

    const [_, setDashboardIdHash] = useHashParam('dashboard');
    const handleNewDashboard = async () => {
        const newDashboardId = await DashboardsRepository.saveDashboardAsync({
            name: 'New dashboard'
        });
        await setDashboardIdHash(newDashboardId);
    };

    const [showWidgetStore, setShowWidgetStore] = useState(false);
    const handleAddWidget = (widgetType: widgetType) => {
        selectedDashboard.item?.widgets.push(new WidgetModel('new-widget', selectedDashboard.item.widgets.length, widgetType));
        setShowWidgetStore(false);
    };

    const handleAddWidgetPlaceholder = () => {
        setIsEditing(true);
        setShowWidgetStore(true);
    }

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
                                <Button variant="outlined" size="large" onClick={() => setShowWidgetStore(true)} sx={{ width: '250px' }}>Add widget...</Button>
                                <LoadingButton loading={isSavingEdit} variant="outlined" size="large" onClick={handleEditDone} fullWidth>Done editing</LoadingButton>
                            </Stack>
                        </Box>
                    )}
                </Stack>
                {selectedDashboard.isLoading ?
                    <LinearProgress /> : (
                        <Box sx={{ px: 2 }}>
                            {selectedDashboard.item
                                ? (
                                    <DashboardView
                                        dashboard={selectedDashboard.item}
                                        isEditing={isEditing}
                                        onAddWidget={handleAddWidgetPlaceholder} />
                                ) : (
                                    <Stack alignItems="center" justifyContent="center">
                                        <Stack sx={{ height: '80vh' }} alignItems="center" justifyContent="center" direction="row">
                                            <Stack maxWidth={280} spacing={4} alignItems="center" justifyContent="center">
                                                <Image width={280} height={213} alt="No Dashboards placeholder" src="/assets/placeholders/placeholder-no-dashboards.svg" />
                                                <Typography variant="h1">No Dashboards</Typography>
                                                <Typography textAlign="center" color="textSecondary">You don’t have any dashboards. Create a dashboard to get started.</Typography>
                                                <Button variant="contained" onClick={handleNewDashboard}>New Dashboard</Button>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                )}
                        </Box>
                    )}
            </Stack>
            <DashboardSettings
                dashboard={selectedDashboard.item}
                isOpen={isDashboardSettingsOpen}
                onClose={() => setIsDashboardSettingsOpen(false)} />
            <ConfigurationDialog isOpen={showWidgetStore} onClose={() => setShowWidgetStore(false)} title="Add widget" maxWidth="lg" >
                <WidgetStoreDynamic onAddWidget={handleAddWidget} />
            </ConfigurationDialog>
        </>
    );
};

export default observer(Dashboards);
