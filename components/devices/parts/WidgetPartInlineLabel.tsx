import { Grid, Typography } from "@material-ui/core"
import React from "react"

export interface IWidgetPartInlineLabelConfig {
    label: string,
    icon:
    "questionmark" |
    "lock" |
    "power" |
    "touch" |
    "light" |
    "flower" |
    "motion"
}

const WidgetPartInlineLabel = ({ config }: { config: IWidgetPartInlineLabelConfig }) => {
    return (
        <Grid container>
            <Grid item>
                Icon
            </Grid>
            <Grid item>
                <Typography>{config.label}</Typography>
            </Grid>
        </Grid>
    );
}

export default WidgetPartInlineLabel;