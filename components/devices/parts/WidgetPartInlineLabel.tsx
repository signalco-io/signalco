import { Box, Grid, Typography } from "@material-ui/core"
import React from "react"
import IconResolver from '../../icons/IconResolver';

export interface IWidgetPartInlineLabelConfig {
    label?: string,
    icon?: "questionmark" | "lock" | "power" | "touch" | "light" | "flower" | "motion" | "window" | "door",
    size?: "small" | "normal" | "large",
    value?: string,
    units?: string
}

const sizeToTypographyVariant = (size?: "small" | "normal" | "large") => {
    return size === "large" ? "body1" : (size === "small" ? "caption" : "body2")
}

const sizeToFontSize = (size?: "small" | "normal" | "large") => {
    return size === "large" ? "large" : (size === "small" ? "small" : "medium")
}

const sizeToPadding = (size?: "small" | "normal" | "large") => {
    return size === "large" ? 1.5 : (size === "small" ? 0 : 0.5);
}

const WidgetPartInlineLabel = ({ config }: { config: IWidgetPartInlineLabelConfig }) => {
    const IconComponent = config.icon ? IconResolver(config.icon) : undefined;

    return (
        <Grid container direction="column" style={{ height: '100%' }} justifyContent="center">
            <Box px={1} py={sizeToPadding(config.size)}>
                <Grid container alignItems="center" spacing={1} wrap="nowrap">
                    {IconComponent &&
                        <Grid item sx={{ minWidth: 35, marginTop: config.size === "small" ? '6px' : 0 }}>
                            <IconComponent fontSize={sizeToFontSize(config.size)} />
                        </Grid>}
                    {config.label &&
                        <Grid item style={{ flexGrow: 1 }} zeroMinWidth>
                            <Typography noWrap variant={sizeToTypographyVariant(config.size)}>{config.label}</Typography>
                        </Grid>}
                    {config.value &&
                        <Grid item>
                            <Typography variant={sizeToTypographyVariant(config.size)}>{`${config.value}${config.units ? config.units : ''}`}</Typography>
                        </Grid>}
                </Grid>
            </Box>
        </Grid>
    );
}

export default WidgetPartInlineLabel;