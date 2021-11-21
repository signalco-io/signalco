import { BatteryCharging20Outlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import React from "react";
import IWidgetConfigurationOption from "../../../src/widgets/IWidgetConfigurationOption";
import { DefaultHeight, DefaultLabel, DefaultWidth } from "../../../src/widgets/WidgetConfigurationOptions";
import { IWidgetSharedProps } from "../Widget";
import WidgetCard from "./WidgetCard";

const stateOptions: IWidgetConfigurationOption[] = [
    DefaultLabel,
    DefaultWidth(4),
    DefaultHeight(4),
];

const WidgetVacuum = (props: IWidgetSharedProps) => {
    const state = false;
    const label = props.config?.label ?? '';
    const batteryPerc = 100;

    return (
        <WidgetCard
            state={state}
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