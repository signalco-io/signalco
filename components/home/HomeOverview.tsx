import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useLayoutEffect, useState } from "react";
import EditSharpIcon from '@mui/icons-material/EditSharp';
import HttpService from "../../src/services/HttpService";
import { observer } from "mobx-react-lite";
import Widget, { widgetType } from "../devices/Widget";
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DashboardsRepository, { DashboardSetModel, IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import { Add, AddOutlined, Close, SaveOutlined } from "@mui/icons-material";
import WidgetStore from "../devices/WidgetStore";
import PageNotificationService from "../../src/notifications/PageNotificationService";

const isServerSide = typeof window === 'undefined';

interface IWidget {
    type: widgetType,
    config?: object
}

interface IDashboard {
    source?: IDashboardModel,
    id?: string,
    name: string,
    widgets: IWidget[]
}

const HomeOverview = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [executedConduct, setExecutedConduct] = useState(false);
    const [dashboards, setDashboards] = useState<IDashboard[]>([]);
    const [dashboardIndex, setDashboardIndex] = React.useState('0');
    const [dashboardsUpdateAvailable, setDashboardsUpdateAvailable] = useState(false);
    const [isWidgetStoreOpen, setIsWidgetStoreOpen] = useState<boolean>(false);
    const [editingDashboard, setEditingDashboard] = useState<IDashboard | undefined>();

    const handleDashboardChange = (_event: React.SyntheticEvent, newValue: string) => {
        setDashboardIndex(newValue);
    };

    // const handleAddDashboard = () => {
    //     const newDashboard = { name: 'New dashboard', widgets: [] };
    //     setDashboards([...dashboards, newDashboard]);
    // };

    const handleEdit = () => {
        setEditingDashboard(dashboards[Number.parseInt(dashboardIndex, 10) || 0]);
        setIsEditing(true);
    }

    const handleEditComplete = async () => {
        if (!editingDashboard) return;
        const index = Number.parseInt(dashboardIndex, 10) || 0;

        // Replace dashboard with edited version
        dashboards.splice(index, 1, editingDashboard);
        setEditingDashboard(undefined);

        // Persist dashboard config
        const currentDashboard = dashboards[index];
        const dashboardSet = new DashboardSetModel(currentDashboard.name);
        dashboardSet.id = currentDashboard.id;
        dashboardSet.configurationSerialized = JSON.stringify({
            widgets: currentDashboard.widgets
        });
        await DashboardsRepository.saveDashboardAsync(dashboardSet);
        setIsEditing(false);
    };

    const loadDashboardsAsync = async () => {
        try {
            const dashboards = await DashboardsRepository.getDashboardsAsync();
            setDashboards(dashboards.map(d => ({
                source: d,
                id: d.id,
                name: d.name,
                widgets: typeof d.configurationSerialized !== 'undefined' ? JSON.parse(d.configurationSerialized).widgets : []
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

    useEffect(() => {
        if (window.location.search.startsWith('?do=')) {
            const conductRaw = decodeURIComponent(window.location.search.substring(9));
            const conductReq = JSON.parse(conductRaw);
            (async () => {
                await HttpService.requestAsync("/conducts/request", "post", {
                    deviceId: conductReq.di,
                    channelName: "signal",
                    contactName: conductReq.c,
                    valueSerialized: "1"
                });
                setExecutedConduct(true);
            })();
        }
    }, []);

    const handleWidgetSetConfig = async (dashboard: IDashboard, widget: IWidget, config: object) => {
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

    const RenderDashboard = ({ dashboard }: { dashboard: IDashboard }) => {
        const [numberOfColumns, setNumberOfColumns] = useState(4);
        const widgetSpacing = 1;
        const widgetSize = 78 + widgetSpacing * 8;
        const dashbaordPadding = 48;

        useLayoutEffect(() => {
            function updateNumberOfColumns() {
                // When width is less than 400, set to quad column
                const width = window.innerWidth - dashbaordPadding;
                const numberOfColumns = Math.max(4, Math.floor(width / widgetSize));

                setNumberOfColumns(numberOfColumns);
            }
            window.addEventListener('resize', updateNumberOfColumns);
            updateNumberOfColumns();
            return () => window.removeEventListener('resize', updateNumberOfColumns);
        }, [widgetSize]);

        return (
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
                gap: widgetSpacing,
                width: `${widgetSize * numberOfColumns - widgetSpacing * 8}px`
            }}>
                {dashboard.widgets.map((widget, index) => (
                    <Widget
                        key={index}
                        onRemove={() => handleWidgetRemove(widget)}
                        isEditMode={isEditing}
                        type={widget.type}
                        config={widget.config}
                        setConfig={(config) => handleWidgetSetConfig(dashboard, widget, config)} />
                ))}
            </Box>
        );
    };

    const handleOpenWidgetStore = () => {
        setIsWidgetStoreOpen(true);
    }

    const handleWidgetAdd = (type: widgetType) => {
        if (!editingDashboard) return;

        editingDashboard.widgets.push({ type: type });
        setEditingDashboard({ ...editingDashboard });
        setIsWidgetStoreOpen(false);
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 760;

    if (!isServerSide &&
        window.location.search.startsWith("?do=")) {
        if (executedConduct)
            return <div>Done</div>
        return <div>Doing...</div>
    }

    return (
        <Grid container direction="column" spacing={1} wrap="nowrap">
            {isLoading ? (
                <Grid item>
                    <LinearProgress />
                </Grid>
            ) : (
                <TabContext value={dashboardIndex}>
                    {dashboardsUpdateAvailable && (
                        <Grid item>
                            <Alert
                                severity="info"
                                style={{ borderRadius: 0 }}
                                action={<Button variant="contained" size="small" onClick={handleApplyDashboardsUpdate}>Apply update</Button>}>
                                New version of dashboards are available.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item>
                        {isEditing ? (
                            <>
                                <Alert
                                    severity="info"
                                    style={{ borderRadius: 0 }}
                                    action={
                                        <Stack spacing={1} direction="row">
                                            <IconButton size="small" onClick={handleOpenWidgetStore}>
                                                <AddOutlined />
                                            </IconButton>
                                            <IconButton size="small" onClick={handleEditComplete} title="Confirm edit">
                                                <SaveOutlined />
                                            </IconButton>
                                        </Stack>}>
                                    In editing mode... Add, move, resize your items.
                                </Alert>
                                <Dialog open={isWidgetStoreOpen} maxWidth="lg" fullWidth fullScreen={isMobile} scroll="paper">
                                    <DialogTitle>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="h2">Widget store</Typography>
                                            <IconButton title="Close" onClick={() => setIsWidgetStoreOpen(false)}>
                                                <Close />
                                            </IconButton>
                                        </Stack>
                                    </DialogTitle>
                                    <DialogContent>
                                        <WidgetStore onAddWidget={handleWidgetAdd} />
                                    </DialogContent>
                                </Dialog>
                            </>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item>
                                    <TabList selectionFollowsFocus scrollButtons="auto" variant="scrollable" onChange={handleDashboardChange} aria-label="Dashboard tabs">
                                        {dashboards.length ? dashboards.map((d, index) => (
                                            <Tab key={index.toString()} label={d.name} value={index.toString()} />
                                        )) : undefined}
                                        <Tab key={(dashboards.length || 0).toString()} icon={<Add />} value={(dashboards.length || 0).toString()} />
                                    </TabList>
                                </Grid>
                                <Grid item sx={{ flexGrow: 1, textAlign: "end", px: 2 }}>
                                    <Button disabled={isLoading} startIcon={<EditSharpIcon />} onClick={handleEdit}>Edit</Button>
                                </Grid>
                            </Grid>
                        )
                        }
                    </Grid>
                    <Grid item>
                        {dashboards.length ?
                            dashboards.map((d, index) => (
                                <TabPanel value={index.toString()} key={index.toString()}>
                                    <RenderDashboard dashboard={editingDashboard || d} />
                                </TabPanel>
                            ))
                            : (
                                <Box textAlign="center" sx={{ m: 2 }}>
                                    <NoDataPlaceholder content="No dashboards available" />
                                </Box>
                            )}
                    </Grid>
                </TabContext>
            )}
        </Grid>
    );
};

export default observer(HomeOverview);