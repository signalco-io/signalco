import { Box, Grid, Typography } from "@material-ui/core"
import React from "react"
import IconResolver, { availableIcons } from '../../icons/IconResolver';

export interface IWidgetPartInlineLabelConfig {
    label?: string,
    icon?: availableIcons,
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
    return size === "large" ? 2 : (size === "small" ? 0 : 1);
}

const WidgetPartInlineLabel = ({ config }: { config: IWidgetPartInlineLabelConfig }) => {
    const Icon = IconResolver(config.icon);
    return (
        <Grid container direction="column" style={{ height: '100%' }} justifyContent="center">
            <Box px={1.5} py={sizeToPadding(config.size)}>
                <Grid container alignItems="center" spacing={1} wrap="nowrap">
                    {config.icon &&
                        <Grid item sx={{ minWidth: 35, marginTop: config.size !== "large" ? '6px' : 0 }}>
                            <Icon fontSize={sizeToFontSize(config.size)} />
                        </Grid>}
                    {config.label &&
                        <Grid item style={{ flexGrow: 1 }} zeroMinWidth>
                            <Typography noWrap variant={sizeToTypographyVariant(config.size)} color={config.size === "small" ? "textSecondary" : "textPrimary"}>{config.label}</Typography>
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