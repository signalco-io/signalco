import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Dialog, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, OutlinedInput, Stack, Typography } from "@mui/material";
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
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';
import { AddOutlined, Check, SaveOutlined } from "@mui/icons-material";
import Image from 'next/image';
import useSearch, { filterFuncObjectStringProps } from "../../src/hooks/useSearch";

const isServerSide = typeof window === 'undefined';

interface IWidget {
    type: widgetType,
    config?: object
}

interface IDashboard {
    id: string,
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
    const [isAddWidgetOpen, setIsAddWidgetOpen] = useState<boolean>(false);

    const handleDashboardChange = (_event: React.SyntheticEvent, newValue: string) => {
        setDashboardIndex(newValue);
    };

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleEditComplete = () => {
        // TODO: Persist dashboard config
        setIsEditing(false);
    };

    const loadDashboardsAsync = async () => {
        try {
            const dashboards = await DashboardsRepository.getDashboardsAsync();
            setDashboards(dashboards.map(d => ({
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
                        <Widget type={widget.type} config={widget.config} />
                    </MasonryItem>
                ))}
            </Masonry>
        );
    };

    const handleAddWidget = () => {
        setIsAddWidgetOpen(true);
    }

    const handleWidgetAdd = (type: widgetType) => {
        const currentDashboard = dashboards[Number.parseInt(dashboardIndex, 10) || 0];
        currentDashboard.widgets.push({ type: type });
        setDashboards([...dashboards]);
        setIsAddWidgetOpen(false);
    };

    const availableWidgets = [
        {
            type: 'state',
            name: 'State widget',
            description: 'Control and see state of any integrated entity.',
            preview: '/assets/widget-previews/WidgetStatePreview_dark.svg'
        },
        {
            type: 'shades',
            name: 'Shades widget',
            description: 'Control and see state of window shades.',
            preview: '/assets/widget-previews/WidgetShadesPreview_dark.svg',
            previewWidth: 300
        },
        {
            type: 'vacuum',
            name: 'Vacuum widget',
            description: 'Control and see state of your robot vacuum.',
            preview: '/assets/widget-previews/WidgetVacuumPreview_dark.svg',
            previewWidth: 200,
            previewHeight: 200
        }
    ];

    const WidgetStore = (props: { isOpen: boolean }) => {
        const [filteredAvailableWidgetsItems, showAvailableWidgetsSearch, searchAvailableWidgetsText, handleSearchAvailableWidgetsTextChange] =
            useSearch(availableWidgets, filterFuncObjectStringProps, 6);

        const isMobile = typeof window !== 'undefined' && window.innerWidth < 760;

        return (
            <Dialog open={props.isOpen} maxWidth="lg" fullScreen={isMobile}>
                <DialogTitle>Add widget</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        {showAvailableWidgetsSearch && <OutlinedInput placeholder="Search..." value={searchAvailableWidgetsText} onChange={(e) => handleSearchAvailableWidgetsTextChange(e.target.value)} />}
                        <Stack direction="row">
                            <Typography color="text.secondary">{filteredAvailableWidgetsItems.length} widget{filteredAvailableWidgetsItems.length > 1 ? 's' : ''} available</Typography>
                        </Stack>
                        <div>
                            <Grid container spacing={1}>
                                {filteredAvailableWidgetsItems.map((availableWidget, index) => (
                                    <Grid item key={`${availableWidget.type}-${index}`}>
                                        <Card sx={{ minWidth: '320px' }}>
                                            <CardHeader title={availableWidget.name} />
                                            <CardMedia>
                                                <Box sx={{ width: '100%', height: '230px', background: 'black', display: 'flex', 'justifyContent': 'center' }}>
                                                    <Image
                                                        src={availableWidget.preview}
                                                        alt={`${availableWidget.name} Preview`}
                                                        width={availableWidget.previewWidth || 165}
                                                        height={availableWidget.previewHeight || 165} />
                                                </Box>
                                            </CardMedia>
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary">
                                                    {availableWidget.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton aria-label="Add to dashboard" onClick={() => handleWidgetAdd(availableWidget.type)}>
                                                    <AddOutlined />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    </Stack>
                </DialogContent>
            </Dialog>
        );
    };

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
                                            <IconButton size="small" onClick={handleAddWidget}>
                                                <AddOutlined />
                                            </IconButton>
                                            <IconButton size="small" onClick={handleEditComplete} title="Confirm edit">
                                                <SaveOutlined />
                                            </IconButton>
                                        </Stack>}>
                                    In editing mode... Add, move, resize your items.
                                </Alert>
                                <WidgetStore isOpen={isAddWidgetOpen} />
                            </>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item>
                                    <TabList onChange={handleDashboardChange} aria-label="Dashboard tabs">
                                        {dashboards.length ? dashboards.map((d, index) => (
                                            <Tab key={index.toString()} label={d.name} value={index.toString()} />
                                        )) : undefined}
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