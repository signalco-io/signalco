import { Box, Grid, IconButton } from "@material-ui/core";
import React from "react";
import { IDeviceTargetWithValueFallback } from "../../../src/devices/Device";
import IconResolver, { availableIcons } from '../../icons/IconResolver';

export interface IWidgetPartButtonConfig {
    icon: availableIcons,
    label: string,
    small?: boolean,
    actionSource: IDeviceTargetWithValueFallback,
    action: () => Promise<void>
}

const WidgetPartButton = ({ config }: { config: IWidgetPartButtonConfig }) => {
    const Icon = IconResolver(config.icon);

    const handleClick = async () => {
        await config.action();
    };

    return (
        <Box px={1.5} sx={{ height: '100%' }}>
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <IconButton
                    disabled={typeof config.action === 'undefined'}
                    size={config.small ? "small" : "medium"}
                    aria-label={config.label}
                    title={config.label}
                    onClick={handleClick}>
                    <Icon fontSize={config.small ? "small" : "medium"} />
                </IconButton>
            </Grid>
        </Box>
    );
};

export default WidgetPartButton;