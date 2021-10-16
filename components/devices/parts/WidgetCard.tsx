import { Paper } from "@mui/material";
import React from "react";

const WidgetCard = (props: { children: JSX.Element, width: number, height: number, state: boolean }) => {
    const sizeWidth = props.width * 78 + (props.width - 1) * 8;
    const sizeHeight = props.height * 78 + (props.height - 1) * 8;

    return (
        <Paper sx={{ borderRadius: 2, width: sizeWidth, height: sizeHeight, display: "block" }} variant="elevation" elevation={props.state ? 1 : 0} >
            {props.children}
        </Paper >
    );
}

export default WidgetCard;