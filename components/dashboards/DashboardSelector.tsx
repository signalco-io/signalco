import { Button, Divider, Paper, Popover, Stack, Typography } from "@mui/material";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { IDashboard } from "./Dashboards";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AddSharp } from "@mui/icons-material";

interface IDashboardSelectorMenuProps {
    dashboardIndex: number,
    dashboards: IDashboard[],
    onSelection: (index: number) => void,
    onNewDashboard: () => void,
    onEditWidgets: () => void,
    onSettings: () => void
}

const DashboardSelectorMenu = (props: IDashboardSelectorMenuProps) => {
    const { dashboardIndex, dashboards, onSelection, onNewDashboard, onEditWidgets, onSettings } = props;
    const handleDashboardSelected = onSelection;

    const currentName = dashboards[dashboardIndex]?.name;

    return (
        <Paper sx={{ minWidth: 320 }}>
            <Stack>
                <Stack sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                    {dashboards.map((d, i) =>
                        <Button key={d.id} disabled={i === dashboardIndex} size="large" onClick={() => handleDashboardSelected(i)}>{d.name}</Button>)}
                </Stack>
                <Button onClick={onNewDashboard} size="large" startIcon={<AddSharp />}>New dashboard...</Button>
                <Divider />
                <Typography variant="subtitle1" color="textSecondary" sx={{ p: 2 }}>Dashboard {currentName}</Typography>
                <Button size="large" onClick={onSettings}>Settings...</Button>
                <Button size="large" onClick={onEditWidgets}>Edit widgets...</Button>
            </Stack>
        </Paper>
    );
};

export interface IDashboardSelectorProps {
    dashboards: IDashboard[],
    dashboardIndex: number,
    onSelection: (index: number) => void,
    onNewDashboard: () => void,
    onEditWidgets: () => void,
    onSettings: () => void
}

const DashboardSelector = (props: IDashboardSelectorProps) => {
    const { dashboards, dashboardIndex, onSelection, onNewDashboard, onEditWidgets, onSettings } = props;
    const popupState = usePopupState({ variant: 'popover', popupId: 'dashboardsMenu' });

    const currentName = dashboards[dashboardIndex]?.name;

    const handleDashboardSelected = (index: number) => {
        onSelection(index);
        popupState.close();
    };

    const handleNewDashboard = () => {
        onNewDashboard();
        popupState.close();
    }

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
                <DashboardSelectorMenu
                    dashboardIndex={dashboardIndex}
                    dashboards={dashboards}
                    onSelection={handleDashboardSelected}
                    onNewDashboard={handleNewDashboard}
                    onEditWidgets={onEditWidgets}
                    onSettings={onSettings} />
            </Popover>
        </>
    );
};

export default DashboardSelector;