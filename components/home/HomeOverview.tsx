import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';
import { Add, AddOutlined, Close, PlusOneSharp, SaveOutlined } from "@mui/icons-material";
import WidgetStore from "../devices/WidgetStore";

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

    const handleDashboardChange = (_event: React.SyntheticEvent, newValue: string) => {
        setDashboardIndex(newValue);
    };

    const handleAddDashboard = () => {
        const newDashboard = { name: 'New dashboard', widgets: [] };
        setDashboards([...dashboards, newDashboard]);
    };

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleEditComplete = async () => {
        // Persist dashboard config
        const currentDashboard = dashboards[Number.parseInt(dashboardIndex, 10) || 0];
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
            // TODO: Display error message
            console.warn("Failed to load dashboards", error);
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

    const RenderDashboard = ({ dashboard }: { dashboard: IDashboard }) => {
        // When width is less than 400, set to quad column
        const width = isServerSide ? 420 : window.innerWidth;
        const numberOfColumns = Math.floor(width / (78 + 16));

        return (
            <Masonry
                columns={numberOfColumns}
                spacing={1}>
                {dashboard.widgets.map((widget, index) => (
                    <MasonryItem key={index} columnSpan={2}>
                        <Widget type={widget.type} config={widget.config} setConfig={(config) => handleWidgetSetConfig(dashboard, widget, config)} />
                    </MasonryItem>
                ))}
            </Masonry>
        );
    };

    const handleOpenWidgetStore = () => {
        setIsWidgetStoreOpen(true);
    }

    const handleWidgetAdd = (type: widgetType) => {
        const currentDashboard = dashboards[Number.parseInt(dashboardIndex, 10) || 0];
        currentDashboard.widgets.push({ type: type });
        setDashboards([...dashboards]);
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
                                <Dialog open={isWidgetStoreOpen} maxWidth="lg" fullScreen={isMobile} scroll="paper" sx={{ minWidth: '320px' }}>
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
                                    <TabList onChange={handleDashboardChange} aria-label="Dashboard tabs">
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
                                    <RenderDashboard dashboard={d} />
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