import { Box, Button, LinearProgress, Paper, Popover, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { widgetType } from "../widgets/Widget";
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";
import DashboardsRepository, { IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import PageNotificationService from "../../src/notifications/PageNotificationService";
import ConfigurationDialog from "../shared/dialog/ConfigurationDialog";
import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from 'material-ui-popup-state/hooks';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DashboardsUpdateChecker from "./DashboardsUpdateChecked";
import DashboardView from "./DashboardView";

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
    const [dashboardIndex, setDashboardIndex] = React.useState('0');
    //const [isWidgetStoreOpen, setIsWidgetStoreOpen] = useState<boolean>(false);
    //const [editingDashboard, setEditingDashboard] = useState<IDashboard | undefined>();
    const dashboardOptions = usePopupState({ variant: 'popover', popupId: 'dashboardMenu' });
    const [isConfiguringDashboard, setIsConfiguringDashboard] = useState<boolean>(false);

    const handleDashboardChange = (newValue: number) => {
        setDashboardIndex(newValue);
        console.debug('Switched to dashboard', newValue);
    };

    // const handleAddDashboard = async () => {
    //     console.log("Adding new dashboard...");

    //     const newDashboard = { name: 'New dashboard', widgets: [] };
    //     setDashboards([...dashboards, newDashboard]);
    //     await saveDashboardEditAsync(newDashboard);
    // };

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

    const handleEditComplete = async () => {
        if (!editingDashboard) return;
        await saveDashboardEditAsync(editingDashboard);
        setEditingDashboard(undefined);
        setIsEditing(false);
        await DashboardsRepository.isUpdateAvailableAsync();
        await DashboardsRepository.applyDashboardsUpdateAsync();
        await loadDashboardsAsync();
    };

    const loadDashboardsAsync = async () => {
        try {
            const dashboards = await DashboardsRepository.getDashboardsAsync();
            setDashboards(dashboards.map(d => ({
                source: d,
                id: d.id,
                name: d.name,
                widgets: (typeof d.configurationSerialized !== 'undefined' ? JSON.parse(d.configurationSerialized).widgets as Array<IWidget> : []).map((w, i) => ({ ...w, id: i.toString() }))
            })));
        } catch (error) {
            console.warn("Failed to load dashboards", error);
            PageNotificationService.show("Failed to load dashboards. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyDashboardsUpdate = async () => {
        setDashboardsUpdateAvailable(false);
        await DashboardsRepository.applyDashboardsUpdateAsync();
        await loadDashboardsAsync();
    };

    const checkDashboardUpdateAsync = async () => {
        try {
            setDashboardsUpdateAvailable(await DashboardsRepository.isUpdateAvailableAsync());
        } catch (err) {
            console.warn("Failed to check dashboards update", err);
        }
    };

    useEffect(() => {
        loadDashboardsAsync();

        // Set interval for checking dashboard updates (30min)
        const token = setInterval(checkDashboardUpdateAsync, 30 * 60000);
        checkDashboardUpdateAsync();
        return () => clearInterval(token);
    }, []);

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
        setIsWidgetStoreOpen(false);
    }

    const handleOpenWidgetStore = () => {
        setIsWidgetStoreOpen(true);
    }

    const handleWidgetAdd = (type: widgetType) => {
        if (!editingDashboard) return;

        editingDashboard.widgets.push({ id: editingDashboard.widgets.length.toString(), type: type });
        setEditingDashboard({ ...editingDashboard });
        setIsWidgetStoreOpen(false);
    };

    const handleConfigureDashboard = () => {
        setIsConfiguringDashboard(true);
        dashboardOptions.close();
    };

    const DashboardSelector = (props: { onSelection: (index: number) => void }) => {
        const popupState = usePopupState({ variant: 'popover', popupId: 'dashboardsMenu' });

        const currentName = dashboards[dashboardIndex]?.name;

        const handleDashboardSelected = (index: number) => {
            props.onSelection(index);
        };

        return (
            <>
                <Button
                    {...bindTrigger(popupState)}
                    sx={{
                        textTransform: 'none'
                    }}>
                    <Stack spacing={1} sx={{ pl: 1 }} direction="row" alignItems="center">
                        <Typography variant="h2" fontWeight={500} fontSize={{ mobile: 18, tablet: 24 }}>{currentName}</Typography>
                        <KeyboardArrowDownIcon sx={{ fontSize: { mobile: "32px", tablet: "large" } }} />
                    </Stack>
                </Button>
                <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}>
                    <Paper sx={{ minWidth: 220 }}>
                        <Stack>
                            {dashboards.map((d, i) =>
                                <Button key={d.id} disabled={i === dashboardIndex} size="large" onClick={() => handleDashboardSelected(i)}>{d.name}</Button>)}
                        </Stack>
                    </Paper>
                </Popover>
            </>
        );
    };

    return (
        <>
            <DashboardsUpdateChecker onReload={loadDashboardsAsync} />
            <Stack spacing={{ mobile: 1, tablet: 4 }} sx={{ pt: { mobile: 0, tablet: 4 } }}>
                <div>
                    <DashboardSelector onSelection={handleDashboardChange} />
                </div>
                {isLoading ?
                    <LinearProgress /> : (
                        <Box sx={{ px: { mobile: 2, tablet: 0 } }}>
                            {dashboards.length ?
                                <DashboardView dashboard={editingDashboard || dashboards[dashboardIndex]}
                                    isEditing={isEditing}
                                    handleWidgetRemove={handleWidgetRemove}
                                    handleWidgetSetConfig={handleWidgetSetConfig} />
                            </TabPanel>
                    ))
                : (
                <Box textAlign="center" sx={{ m: 2 }}>
                    <NoDataPlaceholder content="No dashboards available" />
                </Box>
                        )}
            </TabContext>
            )}
        </Stack>
    );
};

export default observer(Dashboards);