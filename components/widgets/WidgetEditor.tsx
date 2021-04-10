import { Box, Grid, Paper, Slider, Tab, TextField, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import Widget, { IWidgetPart } from "../devices/Widget";
import { makeAutoObservable } from "mobx";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";

class WidgetPartsBuilder {
    parts: IWidgetPart[] = [];
    columns?: number = 1;
    rows?: number = 1;

    constructor() {
        makeAutoObservable(this);
    }
}

const FormNumberSlider = (props: { value?: number, defaultValue?: number, onChange: (value?: number) => void, label: string, labelMinWidth?: number | string }) => {
    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item sx={{ minWidth: props.labelMinWidth }}>
                <Typography>{props.label}</Typography>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
                <Slider
                    defaultValue={props.defaultValue}
                    step={1}
                    max={Math.max(10, props.value ?? 1)}
                    min={1}
                    marks
                    valueLabelDisplay="auto"
                    value={props.value}
                    onChange={(_, v) => props.onChange(parseInt(v?.toString(), 10) || undefined)} />
            </Grid>
            <Grid item>
                <TextField style={{ width: '60px' }} value={props.value} onChange={(e) => props.onChange(parseInt(e.target.value.toString(), 10) || undefined)} />
            </Grid>
        </Grid>
    );
}

const WidgetEditor = observer((props: { columnWidth: number }) => {
    const builder = useMemo(() => new WidgetPartsBuilder(), []);
    const [tabValue, setTabValue] = React.useState('1');

    const handleTabChange = (_: any, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <Grid container direction="column" spacing={2} alignItems="flex-start">
            <Grid item>
                <Grid container>
                    <Widget columnWidth={props.columnWidth} columns={builder.columns || 1} rows={builder.rows || 1} parts={builder.parts} onEditConfirmed={() => { }} isEditingDashboard={false} />
                </Grid>
            </Grid>
            <Grid item>
                <Paper sx={{ minWidth: props.columnWidth * 3 }}>
                    <Box sx={{ display: 'flex', flexGrow: 1 }}>
                        <TabContext value={tabValue}>
                            <TabList
                                orientation="vertical"
                                variant="scrollable"
                                onChange={handleTabChange}
                                value={tabValue}>
                                <Tab label="Style" value="1" />
                                <Tab label="Style" value="2" />
                                <Tab label="Style" value="3" />
                            </TabList>
                            <TabPanel value="1">
                                <Grid container direction="column" spacing={1}>
                                    <Grid item xs={12}>
                                        <FormNumberSlider value={builder.columns} onChange={(v) => builder.columns = v} label="Width" labelMinWidth="80px" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormNumberSlider value={builder.rows} onChange={(v) => builder.rows = v} label="Height" labelMinWidth="80px" />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value="2">
                                <div>2</div>
                            </TabPanel>
                            <TabPanel value="3">
                                <div>3</div>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
});

export default WidgetEditor;