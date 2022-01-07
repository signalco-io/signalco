import { Box, Button, Popover, Stack, Tab, Tabs, Typography } from "@mui/material";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React, { useEffect } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";
import { observer } from "mobx-react-lite";
import useHashParam from "../../src/hooks/useHashParam";
import DashboardSelectorMenu from "./DashboardSelectorMenu";

export interface IDashboardSelectorProps {
    onSelection: (id: string) => void,
    onEditWidgets: () => void,
    onSettings: () => void
}

function DashboardSelector(props: IDashboardSelectorProps) {
    const { onSelection, onEditWidgets, onSettings } = props;
    const popupState = usePopupState({ variant: 'popover', popupId: 'dashboardsMenu' });
    const [selectedId, setSelectedIdHash] = useHashParam('dashboard');

    const dashboards = DashboardsRepository.dashboards;
    const currentDashboard = dashboards.find(d => d.id == selectedId);
    const currentName = currentDashboard?.name;
    const favoriteDashboards = dashboards.filter(d => d.isFavorite);

    // Set initial selection on component and dashboards load
    useEffect(() => {
        if (!selectedId && dashboards.length) {
            setSelectedIdHash(dashboards[0].id);
        }
    }, [selectedId, dashboards, setSelectedIdHash]);

    useEffect(() => {
        if (selectedId)
            onSelection(selectedId);
    }, [selectedId, onSelection]);

    console.debug("Rendering DashboardSelector");

    return (
        <>
            <Stack spacing={{ xs: 0, sm: 2 }} direction="row">
                <Box>
                    <Button {...bindTrigger(popupState)}>
                        <Stack spacing={1} sx={{ pl: 1 }} direction="row" alignItems="center">
                            <Typography variant="h2" fontWeight={500} fontSize={{ xs: 18, sm: 24 }} noWrap>{currentName}</Typography>
                            <KeyboardArrowDownIcon sx={{ fontSize: { xs: "28px", sm: "32px" } }} />
                        </Stack>
                    </Button>
                </Box>
                {favoriteDashboards.length > 0 && (
                    <Tabs
                        value={0}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="pinned dashboards"
                        sx={{
                            ".MuiTabScrollButton-root": {
                                display: 'none'
                            },
                            ".MuiTabs-indicator": {
                                backgroundColor: 'transparent'
                            },
                            ".Mui-selected > h3": {
                                color: 'text.secondary'
                            }
                        }}
                    >
                        {favoriteDashboards.map(fd => (
                            <Tab
                                key={fd.id}
                                sx={{
                                    px: { xs: 0, sm: 2 },
                                    minHeight: { xs: 40, sm: 48 },
                                    minWidth: 80
                                }}
                                onClick={() => setSelectedIdHash(fd.id)}
                                label={<Typography
                                    variant="h3"
                                    fontWeight={400}
                                    fontSize={{ xs: 16, sm: 20 }}
                                    sx={{ opacity: 0.6, textTransform: 'none' }}>{fd.name}</Typography>} />
                        ))}
                    </Tabs>
                )}
            </Stack>
            <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{ elevation: 8, variant: 'elevation' }}>
                <DashboardSelectorMenu
                    selectedId={selectedId}
                    popupState={popupState}
                    onSelection={setSelectedIdHash}
                    onEditWidgets={onEditWidgets}
                    onSettings={onSettings} />
            </Popover>
        </>
    );
}

export default observer(DashboardSelector);
