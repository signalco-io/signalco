import { Alert, Box, Button, Grid, LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import EditSharpIcon from '@material-ui/icons/EditSharp';
import HttpService from "../../src/services/HttpService";
import { observer } from "mobx-react-lite";
import Widget, { IWidgetPart } from "../devices/Widget";
import { useResizeDetector } from 'react-resize-detector';
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";

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
    // const [remoteDashboards, setRemoteDashboards] = useState<IDashboard[]>([]);
    const [dashboardIndex, setDashboardIndex] = React.useState('0');

    const handleDashboardChange = (_event: React.SyntheticEvent, newValue: string) => {
        setDashboardIndex(newValue);
    };

    const handleEdit = () => {

    }

    const handleEditComplete = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        // const loadLocalAsync = async () => {
        //     try {
        //         setDashboards(JSON.parse(localStorage.getItem('dashboards') ?? '{}'));
        //     } catch (error) {
        //         // TODO: Notify user
        //         console.warn("Failed to load local dashboards", error);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };

        const loadRemoteAsync = async () => {
            try {
                const dashboards = await DashboardsRepository.getDashboardsAsync();
                setDashboards(dashboards.map(d => ({
                    id: d.id,
                    name: d.name,
                    widgets: typeof d.configurationSerialized !== 'undefined' ? JSON.parse(d.configurationSerialized).widgets : []
                })));
            } catch (error) {
                // TODO: Display error message
                console.warn("Failed to load remote dashboards", error);
            } finally {
                setIsLoading(false);
            }
        };

        // loadLocalAsync();
        loadRemoteAsync();
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

    if (typeof window !== 'undefined' &&
        window.location.search.startsWith("?do=")) {
        if (executedConduct)
            return <div>Done</div>
        return <div>Doing...</div>
    }

    const RenderDashboard = ({ dashboard }: { dashboard: IDashboard }) => {
        const { width, ref } = useResizeDetector({ handleHeight: false, handleWidth: true });
        const castedRef = ref as React.MutableRefObject<HTMLDivElement | null>; // Workaround from: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572

        if (typeof width === 'undefined')
            return <div ref={castedRef}></div>;

        // When width is less than 400, set to single column
        const mobileWidth = width - 16;
        const numberOfColumns = Math.floor(width / (250 + 16));
        const desktopWidth = Math.max((width - (numberOfColumns * 2 * 8)) / numberOfColumns, 2);
        const columnWidth = width && width < 500 ? mobileWidth : desktopWidth;
        return (
            <Grid container
                spacing={2}
                ref={castedRef}>
                {dashboard.widgets.map((widget, index) => (
                    <Grid item key={index}>
                        <Box>
                            <Widget
                                columnWidth={columnWidth}
                                columns={widget.columns}
                                rows={widget.rows}
                                parts={widget.parts}
                                onEditConfirmed={handleEditComplete} isEditingDashboard={isEditing} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
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