import { Button, Paper, Popover, Stack, Typography } from "@mui/material";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { IDashboard } from "./Dashboards";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const DashboardSelector = (props: { dashboards: IDashboard[], dashboardIndex: number, onSelection: (index: number) => void }) => {
    const { dashboards, dashboardIndex, onSelection } = props;
    const popupState = usePopupState({ variant: 'popover', popupId: 'dashboardsMenu' });

    const currentName = dashboards[dashboardIndex]?.name;

    const handleDashboardSelected = (index: number) => {
        onSelection(index);
        popupState.close();
    };

    return (
        <>
            <Button
                {...bindTrigger(popupState)}
                sx={{
                    textTransform: 'none'
                }}>
                <Stack spacing={1} sx={{ pl: 1 }} direction="row" alignItems="center">
                    <Typography variant="h2" fontWeight={500} fontSize={{ mobile: 18, tablet: 24 }}>{currentName}</Typography>
                    <KeyboardArrowDownIcon sx={{ fontSize: { mobile: "32px", tablet: "large" } }} />
                </Stack>
            </Button>
            <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <Paper sx={{ minWidth: 220 }}>
                    <Stack>
                        {dashboards.map((d, i) =>
                            <Button key={d.id} disabled={i === dashboardIndex} size="large" onClick={() => handleDashboardSelected(i)}>{d.name}</Button>)}
                    </Stack>
                </Paper>
            </Popover>
        </>
    );
};

export default DashboardSelector;