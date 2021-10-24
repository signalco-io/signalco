import { Button, Paper, Stack } from "@mui/material";
import React from "react";

const WidgetCard = (props: { children: JSX.Element, width: number, height: number, state: boolean, needsConfiguration: boolean, onConfigure: () => void }) => {
    const {
        children,
        width,
        height,
        state,
        needsConfiguration,
        onConfigure
    } = props;
    const sizeWidth = width * 78 + (width - 1) * 8;
    const sizeHeight = height * 78 + (height - 1) * 8;

    return (
        <Paper sx={{ borderRadius: 2, width: sizeWidth, height: sizeHeight, display: "block" }} variant="elevation" elevation={state ? 1 : 0}>
            {needsConfiguration ? (
                <Stack justifyContent="stretch" sx={{ height: '100%' }}>
                    <Button size="large" sx={{ height: '100%' }} fullWidth onClick={onConfigure}>Configure widget</Button>
                </Stack>
            ) : (<>{children}</>)}
        </Paper >
    );
}

export default WidgetCard;