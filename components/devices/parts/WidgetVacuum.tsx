import { BatteryCharging20Outlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import WidgetCard from "./WidgetCard";
import { IWidgetConfigurationOption } from "./WidgetConfiguration";

const WidgetVacuum = (/*props: { config?: any }*/) => {
    const [config, setConfig] = useState({});

    const width = 4;
    const height = 4;
    const state = false;
    const label = "Vacuum robot";
    const batteryPerc = 20;

    const needsConfiguration = true;
    const isEditMode = false;
    const stateOptions: IWidgetConfigurationOption[] = [];

    return (
        <WidgetCard
            width={width}
            height={height}
            state={state}
            needsConfiguration={needsConfiguration}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            options={stateOptions}
            config={config}>
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