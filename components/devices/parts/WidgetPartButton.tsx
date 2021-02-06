import { Box, Grid, IconButton } from "@material-ui/core";
import React from "react";
import GradientIcon from "../../icons/GradientIcon";
import IconResolver, { availableIcons } from '../../icons/IconResolver';

export interface IWidgetPartButtonConfig {
    icon: availableIcons,
    small?: boolean
}

const WidgetPartButton = ({ config }: { config: IWidgetPartButtonConfig }) => {
    return (
        <Box px={1.5} sx={{ height: '100%' }}>
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <IconButton size={config.small ? "small" : "medium"}>
                    <GradientIcon
                        icon={IconResolver(config.icon)}
                        fontSize={config.small ? "small" : "medium"}
                        gradient={['#fff', '#ddd']} />
                </IconButton>
            </Grid>
        </Box>
    );
};

export default WidgetPartButton;