import { Box, Grid, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { IDeviceContactState, IDeviceTarget, IDeviceTargetWithValueFallback } from "../../../src/devices/Device";
import IconResolver, { availableIcons } from '../../icons/IconResolver';

export interface IWidgetPartButtonConfig {
    icon: availableIcons,
    label: string,
    small?: boolean,
    actionSource: IDeviceTargetWithValueFallback,
    action: () => Promise<void>,
    stateSource?: IDeviceTarget
    state?: Promise<IDeviceContactState | undefined | null>
}

const WidgetPartButton = ({ config }: { config: IWidgetPartButtonConfig }) => {
    const [buttonState, setButtonState] = useState<IDeviceContactState | null | undefined>(null);

    const Icon = IconResolver(config.icon);

    const handleClick = async () => {
        await config.action();
    };

    useEffect(() => {
        if (config.state != undefined) {
            Promise.resolve(config.state).then((val) => setButtonState(val));
        }
    }, [config.state]);

    return (
        <Box px={2} sx={{ height: '100%' }}>
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <IconButton
                    disabled={typeof config.action === 'undefined'}
                    size={config.small ? "small" : "medium"}
                    aria-label={config.label ?? "Action button"}
                    title={config.label}
                    color={buttonState?.valueSerialized === 'true' ? 'warning' : 'default'}
                    onClick={handleClick}>
                    <Icon fontSize={config.small ? "small" : "medium"} />
                </IconButton>
            </Grid>
        </Box>
    );
};

export default observer(WidgetPartButton);