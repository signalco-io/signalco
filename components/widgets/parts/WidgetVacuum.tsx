import { BatteryCharging20Outlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import React from "react";
import IWidgetConfigurationOption from "../../../src/widgets/IWidgetConfigurationOption";
import { IWidgetSharedProps } from "../Widget";
import WidgetCard from "./WidgetCard";

const stateOptions: IWidgetConfigurationOption[] = [];

const WidgetVacuum = (props: IWidgetSharedProps) => {
    const width = 4;
    const height = 4;
    const state = false;
    const label = "Vacuum robot";
    const batteryPerc = 20;

    const needsConfiguration = true;

    return (
        <WidgetCard
            width={width}
            height={height}
            state={state}
            needsConfiguration={needsConfiguration}
            isEditMode={props.isEditMode}
            onConfigured={props.setConfig}
            options={stateOptions}
            config={props.config}>
            <Stack>
                <Stack>
                    <Typography>{batteryPerc}%</Typography>
                    <BatteryCharging20Outlined />
                </Stack>
                <Typography>{label}</Typography>
            </Stack>
        </WidgetCard>
    );
};

export default WidgetVacuum;