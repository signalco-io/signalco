import { Box, Grid, IconButton } from "@material-ui/core";
import React from "react";
import IconResolver, { availableIcons } from '../../icons/IconResolver';

export interface IWidgetPartButtonConfig {
    icon: availableIcons,
    small?: boolean
}

const WidgetPartButton = ({ config }: { config: IWidgetPartButtonConfig }) => {
    const IconResolved = IconResolver(config.icon);

    return (
        <Box px={1} sx={{height: '100%'}}>
            <Grid container justifyContent="center" alignItems="center" sx={{height: '100%'}}>
                <IconButton size={config.small ? "small" : "medium"}><IconResolved fontSize={config.small ? "small" : "medium"} /></IconButton>
            </Grid>
        </Box>
    );
};

export default WidgetPartButton;