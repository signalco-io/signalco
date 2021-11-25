import { Box, LinearProgress, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { widgetType } from "../widgets/Widget";
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";
import DashboardsRepository, { IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import PageNotificationService from "../../src/notifications/PageNotificationService";
import DashboardsUpdateChecker from "./DashboardsUpdateChecked";
import DashboardView from "./DashboardView";
import DashboardSelector from "./DashboardSelector";
import { useRouter } from "next/router";

export interface IWidget {
    id: string,
    type: widgetType,
    config?: object
}

export interface IDashboard {
    source?: IDashboardModel,
    id?: string,
    name: string,
    widgets: IWidget[]
}

// const DashboardSettings = (props: { isOpen: boolean, dashboard: IDashboard, onClose: () => void, onChange: (dashboard: IDashboard) => void }) => {
//     const { isOpen, dashboard, onClose, onChange } = props;
//     const [name, setName] = useState(dashboard.name);

//     const handleSave = () => {
//         onChange({
//             ...dashboard,
//             name: name
//         });
//     }

//     return (
//         <ConfigurationDialog
//             isOpen={isOpen}
//             title={`Dashboard settings`}
//             onClose={onClose}
//             actions={(
//                 <>
//                     <Button onClick={onClose}>Cancel</Button>
//                     <Button autoFocus onClick={handleSave}>Save changes</Button>
//                 </>
//             )}>
//             <FormGroup>
//                 <TextField label="Name" value={name} onChange={(e) => setName(e.target.value || "")} />
//             </FormGroup>
//         </ConfigurationDialog>
//     );
// };

const Dashboards = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing/*, setIsEditing*/] = useState(false);
    const [dashboards, setDashboards] = useState<IDashboard[]>([]);
    const [dashboardIndex, setDashboardIndex] = React.useState(0);
    //const [isWidgetStoreOpen, setIsWidgetStoreOpen] = useState<boolean>(false);
    const [editingDashboard, setEditingDashboard] = useState<IDashboard | undefined>();

    const router = useRouter();
    //const dashboardOptions = usePopupState({ variant: 'popover', popupId: 'dashboardMenu' });
    //const [isConfiguringDashboard, setIsConfiguringDashboard] = useState<boolean>(false);

    const handleDashboardChange = (newValue: number) => {
        router.push({ hash: dashboards[newValue]?.id });
    };

    const handleNewDashboard = async () => {
        console.debug("Adding new dashboard...");

        const newDashboard = { name: 'New dashboard', widgets: [] };

        const newDashboardId = await DashboardsRepository.saveDashboardAsync(newDashboard);
        await DashboardsRepository.applyDashboardsUpdateAsync();
        await loadDashboardsAsync();

        router.push({ hash: newDashboardId });
    };

    // const handleEdit = () => {
    //     setEditingDashboard(dashboards[Number.parseInt(dashboardIndex, 10) || 0]);
    //     setIsEditing(true);
    //     dashboardOptions.close();
    // }

    // const saveDashboardEditAsync = async (updatedDashboard: IDashboard) => {
    //     // Replace dashboard with edited version
    //     dashboards.splice(dashboardIndex, 1, updatedDashboard);

    //     // Persist dashboard config
    //     const currentDashboard = dashboards[dashboardIndex];
    //     const dashboardSet = new DashboardSetModel(currentDashboard.name);
    //     dashboardSet.id = currentDashboard.id;
    //     dashboardSet.configurationSerialized = JSON.stringify({
    //         widgets: currentDashboard.widgets
    //     });
    //     await DashboardsRepository.saveDashboardAsync(dashboardSet);
    // }

    // const handleEditComplete = async () => {
    //     if (!editingDashboard) return;
    //     await saveDashboardEditAsync(editingDashboard);
    //     setEditingDashboard(undefined);
    //     setIsEditing(false);
    //     await DashboardsRepository.isUpdateAvailableAsync();
    //     await DashboardsRepository.applyDashboardsUpdateAsync();
    //     await loadDashboardsAsync();
    // };

    const loadDashboardsAsync = async () => {
        try {
            const dashboards = await DashboardsRepository.getDashboardsAsync();
            setDashboards(dashboards.map(d => ({
                source: d,
                id: d.id,
                name: d.name,
                widgets: (typeof d.configurationSerialized !== 'undefined' && d.configurationSerialized != null ? JSON.parse(d.configurationSerialized).widgets as Array<IWidget> : []).map((w, i) => ({ ...w, id: i.toString() }))
            })));
        } catch (error) {
            console.warn("Failed to load dashboards", error);
            PageNotificationService.show("Failed to load dashboards. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardsAsync();

        const onHashChanged = () => {
            console.debug('Hash changed', location.hash);

            const matchingDashboardIndex = dashboards.findIndex(d => `#${d.id}` === location.hash);
            if (matchingDashboardIndex >= 0 && dashboardIndex !== matchingDashboardIndex) {
                setDashboardIndex(matchingDashboardIndex);
            }
        };

        window.addEventListener("hashchange", onHashChanged);

        return () => {
            window.removeEventListener("hashchange", onHashChanged);
        };
    }, []);

    useEffect(() => {
        const matchingDashboardIndex = dashboards.findIndex(d => `#${d.id}` === location.hash);
        if (matchingDashboardIndex >= 0 && dashboardIndex !== matchingDashboardIndex) {
            setDashboardIndex(matchingDashboardIndex);
        }
    }, [dashboards, dashboardIndex]);

    const handleWidgetSetConfig = (dashboard: IDashboard, widget: IWidget, config: object) => {
        widget.config = config;
        setDashboards([...dashboards]);
        console.log('updated widgets', dashboard);
    };

    const handleWidgetRemove = (widget: IWidget) => {
        if (!editingDashboard) return;

        const widgetIndex = editingDashboard.widgets.indexOf(widget);
        if (widgetIndex < 0) {
            return;
        }

        editingDashboard.widgets.splice(widgetIndex, 1);
        setEditingDashboard({ ...editingDashboard });
        //setIsWidgetStoreOpen(false);
    }

    // const handleOpenWidgetStore = () => {
    //     setIsWidgetStoreOpen(true);
    // }

    // const handleWidgetAdd = (type: widgetType) => {
    //     if (!editingDashboard) return;

    //     editingDashboard.widgets.push({ id: editingDashboard.widgets.length.toString(), type: type });
    //     setEditingDashboard({ ...editingDashboard });
    //     setIsWidgetStoreOpen(false);
    // };

    // const handleConfigureDashboard = () => {
    //     setIsConfiguringDashboard(true);
    //     dashboardOptions.close();
    // };

    return (
        <>
            <DashboardsUpdateChecker onReload={loadDashboardsAsync} />
            <Stack spacing={{ mobile: 1, tablet: 4 }} sx={{ pt: { mobile: 0, tablet: 4 } }}>
                <div>
                    <DashboardSelector
                        dashboards={dashboards}
                        dashboardIndex={dashboardIndex}
                        onSelection={handleDashboardChange}
                        onNewDashboard={handleNewDashboard} />
                </div>
                {isLoading ?
                    <LinearProgress /> : (
                        <Box sx={{ px: { mobile: 2, tablet: 0 } }}>
                            {dashboards.length ?
                                <DashboardView dashboard={editingDashboard || dashboards[dashboardIndex]}
                                    isEditing={isEditing}
                                    handleWidgetRemove={handleWidgetRemove}
                                    handleWidgetSetConfig={handleWidgetSetConfig} />
                                : (
                                    <Box textAlign="center" sx={{ m: 2 }}>
                                        <NoDataPlaceholder content="No dashboards available" />
                                    </Box>
                                )}
                        </Box>
                    )}
            </Stack>
        </>
    );
};

export default observer(Dashboards);