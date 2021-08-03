import { Box, Grid, Typography } from "@material-ui/core"
import { observer } from "mobx-react-lite";
import React, { useState } from "react"
import { IDeviceTarget } from "../../../src/devices/Device";
import IconResolver, { availableIcons } from '../../icons/IconResolver';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

export interface IWidgetPartInlineLabelConfig {
    label?: string,
    icon?: availableIcons,
    size?: "small" | "normal" | "large",
    value?: string | Promise<string | undefined | null>,
    units?: string
    valueSource?: IDeviceTarget
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
    const [value, setValue] = useState<string | undefined | null>('')

    const isBool = value === "true" || value === "false";
    const switched = isBool ? value === "true" : false;
    const Icon = IconResolver(config.icon, switched);

    Promise.resolve(config.value).then(v => setValue(v));

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
                    {value &&
                        <Grid item>
                            {(isBool && config.units === '') && (value === 'true' ? <CheckCircleIcon color="success" sx={{ mt: 1 }} /> : <CancelIcon color="error" sx={{ mt: 1 }} />)}
                            <Typography variant={sizeToTypographyVariant(config.size)}>{`${isBool && !config.units ? '' : value}${config.units ? config.units : ''}`}</Typography>
                        </Grid>}
                </Grid>
            </Box>
        </Grid>
    );
}

export default observer(WidgetPartInlineLabel);