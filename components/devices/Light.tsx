import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import WbIncandescentOutlinedIcon from '@material-ui/icons/WbIncandescentOutlined';
import React from "react";

export interface ILightProps {
    name?: string,
    inline?: boolean
}

const Light = (props: ILightProps) => {
    return (
        <Box minWidth={220}>
            <Grid container direction="row" justifyContent="space-between" alignItems={props.inline ? "center" : "flex-start"}>
                <Grid item>
                    <Box p={props.inline ? 1 : 2}>
                        <Grid container direction={props.inline ? "row" : "column"} alignItems={props.inline ? "center" : "flex-start"} spacing={1}>
                            <Grid item>
                                <WbIncandescentOutlinedIcon fontSize={props.inline ? "default" : "large"} />
                            </Grid>
                            <Grid item>
                                    <Typography variant={props.inline ? "h5" : "h4"}>{props.name || "Unknown"}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item>
                    <Box p={props.inline ? 0 : 1}>
                        <IconButton aria-label="change device state">
                            <PowerSettingsNewIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Light;