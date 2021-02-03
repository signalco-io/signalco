import { Alert, Box, Grid, Paper } from "@material-ui/core";
import React from "react";
import { rowHeight } from "./parts/Shared";
import WidgetPartButton, { IWidgetPartButtonConfig } from "./parts/WidgetPartButton";
import WidgetPartGraph from "./parts/WidgetPartGraph";
import WidgetPartInlineLabel, { IWidgetPartInlineLabelConfig } from "./parts/WidgetPartInlineLabel";

export interface IWidgetProps {
    isEditingDashboard?: boolean,
    isEditingWidget?: boolean,
    onEditConfirmed: () => void,
    parts: IWidgetPart[],
    columns: number,
    rows: number,
    columnWidth: number
}

export type widgetSize = "auto" | "grow" | "1/12" | "1/6" | "1/4" | "1/3" | "5/12" | "1/2" | "7/12" | "2/3" | "3/4" | "5/6" | "11/12" | "1";

export interface IWidgetPart {
    type: "inlineLabel" | "button" | "graph",
    config: IWidgetPartInlineLabelConfig | IWidgetPartButtonConfig | IWidgetPartGraphConfig,
    size: widgetSize,
    dense?: boolean
}

const resolveSize = (size: widgetSize) => {
    switch (size) {
        case "grow":
        case "auto": return "auto";
        case "1/12": return 1;
        case "1/6": return 2;
        case "1/4": return 3;
        case "1/3": return 4;
        case "5/12": return 5;
        case "1/2": return 6;
        case "7/12": return 7;
        case "2/3": return 8;
        case "3/4": return 9;
        case "5/6": return 10;
        case "11/12": return 11;
        case "1": return 12;
        default: return 12;
    }
}

const PartResolved = ({ part }: { part: IWidgetPart }) => {
    switch (part.type) {
        case "inlineLabel":
            return <WidgetPartInlineLabel config={part.config} />
        case "button":
            return <WidgetPartButton config={part.config} />
        case "graph":
            return <WidgetPartGraph config={part.config} />
        default:
            return <Alert severity="warning">Unkwnown widget part '{part.type}'</Alert>
    }
}

const Widget = (props: IWidgetProps) => {
    return (
        <Paper sx={{ width: props.columnWidth * props.columns, height: props.rows * rowHeight }}>
            <Grid container justifyContent="space-around" alignItems="center">
                {props.parts.map(p => (
                    <Grid item xs={resolveSize(p.size)} sx={{ height: p.dense ? rowHeight/2 : rowHeight, flexGrow: p.size === "grow" ? 1 : 0 }} zeroMinWidth>
                        <PartResolved part={p} />
                    </Grid>))}
            </Grid>
        </Paper>
    )
};

export default Widget;