import { Alert, Box, Button, Grid, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import EditSharpIcon from '@mui/icons-material/EditSharp';
import HttpService from "../../src/services/HttpService";
import { observer } from "mobx-react-lite";
import Widget, { IWidgetPart } from "../devices/Widget";
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';

const isServerSide = typeof window === 'undefined';

interface IWidget {
    columns: number,
    rows: number,
    parts: IWidgetPart[]
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

    const handleDashboardChange = (_event: React.SyntheticEvent, newValue: string) => {
        setDashboardIndex(newValue);
    };

    const handleEdit = () => {

    }

    const handleEditComplete = () => {
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

        // Set interval for checking dashboard updates
        const token = setInterval(checkDashboardUpdateAsync, 60000);
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

    if (!isServerSide &&
        window.location.search.startsWith("?do=")) {
        if (executedConduct)
            return <div>Done</div>
        return <div>Doing...</div>
    }

    const RenderDashboard = ({ dashboard }: { dashboard: IDashboard }) => {
        // When width is less than 400, set to single column
        const width = isServerSide ? 420 : window.innerWidth;
        const mobileWidth = width - 16;
        const numberOfColumns = Math.floor(width / (250 + 16));
        const desktopWidth = Math.max((width - (numberOfColumns * 2 * 8)) / numberOfColumns, 2);
        const columnWidth = width && width < 500 ? mobileWidth : desktopWidth;

        return (
            <Masonry
                columns={numberOfColumns}
                spacing={2}>
                {dashboard.widgets.map((widget, index) => (
                    <MasonryItem key={index}>
                        <Widget
                            columnWidth={columnWidth}
                            columns={widget.columns}
                            rows={widget.rows}
                            parts={widget.parts}
                            onEditConfirmed={handleEditComplete} isEditingDashboard={isEditing} />
                    </MasonryItem>
                ))}
            </Masonry>
        );
    };

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
                                variant="filled"
                                style={{ borderRadius: 0 }}
                                action={<Button variant="contained" size="small" onClick={handleApplyDashboardsUpdate}>Apply update</Button>}>
                                New version of dashboards are available.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item>
                        {isEditing ? (
                            <Alert
                                severity="info"
                                variant="filled"
                                style={{ borderRadius: 0 }}
                                action={<Button variant="contained" size="small" onClick={handleEditComplete}>Done editing</Button>}>
                                Add, move, resize your items.
                            </Alert>
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