import { Button, Divider, Paper, Popover, Stack, Tab, Tabs, Typography } from "@mui/material";
import { bindPopover, bindTrigger, PopupState, usePopupState } from "material-ui-popup-state/hooks";
import React, { useEffect, useMemo } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AddSharp } from "@mui/icons-material";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinSharpIcon from '@mui/icons-material/PushPinSharp';
import DashboardsRepository from "../../src/dashboards/DashboardsRepository";
import { observer } from "mobx-react-lite";
import useHashParam from "../../src/hooks/useHashParam";

interface IDashboardSelectorMenuProps {
    selectedId: string | undefined,
    popupState: PopupState,
    onSelection: (id: string) => void,
    onEditWidgets: () => void,
    onSettings: () => void
}

const DashboardSelectorMenu = observer((props: IDashboardSelectorMenuProps) => {
    const { selectedId, popupState, onSelection, onEditWidgets, onSettings } = props;
    const [_, setDashboardIdHash] = useHashParam('dashboard');

    const handleAndClose = (callback: (...params: any[]) => void) => {
        return (...params: any[]) => {
            callback(...params);
            popupState.close();
        };
    }

    const handleNewDashboard = handleAndClose(async () => {
        const newDashboardId = await DashboardsRepository.saveDashboardAsync({
            name: 'New dashboard'
        });
        setDashboardIdHash(newDashboardId);
    });

    const handleToggleFavorite = async (id: string) => {
        const dashboard = DashboardsRepository.dashboards.find(d => d.id === id);
        if (dashboard) {
            await DashboardsRepository.favoriteSetAsync(dashboard.id, !dashboard.isFavorite);
        }
    }

    const dashboards = DashboardsRepository.dashboards;

    return (
        <Paper sx={{ minWidth: 320 }}>
            <Stack>
                <Stack sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                    {dashboards.map((d) => (
                        <Stack key={d.id} direction="row" sx={{ width: '100%', position: 'relative' }}>
                            <Button
                                disabled={d.id === selectedId}
                                size="large"
                                onClick={() => handleAndClose(onSelection)(d.id)}
                                sx={{ flexGrow: 1, py: 2 }}
                            >
                                <Typography>{d.name}</Typography>
                            </Button>
                            <Button sx={{ position: 'absolute', right: 0, height: '100%' }} onClick={() => handleToggleFavorite(d.id)}>
                                {d.isFavorite ? <PushPinSharpIcon /> : <PushPinOutlinedIcon />}
                            </Button>
                        </Stack>
                    ))}
                </Stack>
                <Button onClick={handleNewDashboard} size="large" startIcon={<AddSharp />} sx={{ py: 2 }}>New dashboard</Button>
                <Divider />
                <Typography variant="subtitle1" color="textSecondary" sx={{ p: 2 }}>Dashboard</Typography>
                <Button size="large" onClick={handleAndClose(onSettings)}>Settings...</Button>
                <Button size="large" onClick={handleAndClose(onEditWidgets)}>Edit widgets...</Button>
            </Stack>
        </Paper>
    );
});

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
    const currentName = useMemo(() => currentDashboard?.name, [currentDashboard]);
    const favoriteDashboards = useMemo(() => dashboards.filter(d => d.isFavorite), [dashboards]);

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
            <Stack spacing={{ mobile: 0, tablet: 2 }} direction="row">
                <div>
                    <Button
                        {...bindTrigger(popupState)}>
                        <Stack spacing={1} sx={{ pl: 1 }} direction="row" alignItems="center">
                            <Typography variant="h2" fontWeight={500} fontSize={{ mobile: 18, tablet: 24 }}>{currentName}</Typography>
                            <KeyboardArrowDownIcon sx={{ fontSize: { mobile: "28px", tablet: "32px" } }} />
                        </Stack>
                    </Button>
                </div>
                {favoriteDashboards.length && (
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
                                    px: { mobile: 0, tablet: 2 },
                                    minHeight: { mobile: 40, tablet: 48 },
                                    minWidth: 80
                                }}
                                onClick={() => setSelectedIdHash(fd.id)}
                                label={<Typography
                                    variant="h3"
                                    fontWeight={400}
                                    fontSize={{ mobile: 16, tablet: 20 }}
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
                }}>
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
