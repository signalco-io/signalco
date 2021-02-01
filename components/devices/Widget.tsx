import { Paper } from "@material-ui/core";
import React from "react";
import WidgetPartInlineLabel, { IWidgetPartInlineLabelConfig } from "./parts/WidgetPartInlineLabel";

export interface IWidgetProps {
    isEditingDashboard?: boolean,
    isEditingWidget?: boolean,
    onEditConfirmed: () => void,
    parts: IWidgetPart[]
}

export interface IWidgetPart {
    type: "inlineLabel" | "status",
    config: 
        IWidgetPartInlineLabelConfig
}

const PartResolved = (part: IWidgetPart) => {
    switch (part.type) {
        case "inlineLabel":
            return <WidgetPartInlineLabel config={part.config} />
        default:
            break;
    }
}

const Widget = (props: IWidgetProps) => {
    return (
        <Paper>
            {props.parts.map(PartResolved)}
        </Paper>
    )
};

export default Widget;