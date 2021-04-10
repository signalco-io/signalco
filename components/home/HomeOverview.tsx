import { Alert, Box, Button, Grid, LinearProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import EditSharpIcon from '@material-ui/icons/EditSharp';
import HttpService from "../../src/services/HttpService";
import { observer } from "mobx-react-lite";
import Widget, { IWidgetPart } from "../devices/Widget";
import { useResizeDetector } from 'react-resize-detector';

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
    const [dashboards, setDashboards] = useState([]);

    const handleEdit = () => {

    }

    const handleEditComplete = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        const loadAsync = async () => {
            try {
                setDashboards(JSON.parse(localStorage.getItem('dashboards') ?? '{}'));
            } catch (error) {
                // TODO: Notify user
                console.warn("Failed to load dashboards", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadAsync();
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

    if (window.location.search.startsWith("?do=")) {
        if (executedConduct)
            return <div>Done</div>
        return <div>Doing...</div>
    }

    const RenderDashboard = ({ dashboard }: { dashboard: IDashboard }) => {
        const { width, ref } = useResizeDetector({ handleHeight: false, handleWidth: true });
        const castedRef = ref as React.MutableRefObject<HTMLDivElement | null>; // Workaround from: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35572

        if (typeof width === 'undefined')
            return <div ref={castedRef}></div>;

        const columnWidth = width && width < 400 ? width / 2 : width / Math.max(Math.floor(width / 220), 2);
        return (
            <Box sx={{ m: { sm: 0, md: 2 } }}>
                <Grid container
                    spacing={0}
                    ref={castedRef}>
                    {dashboard.widgets.map((widget, index) => (
                        <Grid item key={index}>
                            <Widget
                                columnWidth={columnWidth}
                                columns={widget.columns}
                                rows={widget.rows}
                                parts={widget.parts}
                                onEditConfirmed={handleEditComplete} isEditingDashboard={isEditing} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <Grid container direction="column" spacing={1} wrap="nowrap">
            {isLoading ? (
                <Grid item>
                    <LinearProgress />
                </Grid>
            ) : (
                <>
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
                            <Box sx={{ px: 2 }}>
                                <Grid container spacing={1} justifyContent="flex-end">
                                    <Grid item>
                                        <Button disabled={isLoading} startIcon={<EditSharpIcon />} onClick={handleEdit}>Edit</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                        }
                    </Grid>
                    <Grid item>
                        <RenderDashboard dashboard={dashboards[0]} />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default observer(HomeOverview);