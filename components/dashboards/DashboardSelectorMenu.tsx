import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { PopupState } from "material-ui-popup-state/hooks";
import React from "react";
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

function DashboardSelectorMenu(props: IDashboardSelectorMenuProps) {
    const { selectedId, popupState, onSelection, onEditWidgets, onSettings } = props;
    const [_, setDashboardIdHash] = useHashParam('dashboard');
    const [isFullScreen, setFullScreenHash] = useHashParam('fullscreen');

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

    const onFullscreen = () => setFullScreenHash(isFullScreen === 'on' ? undefined : 'on');

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
                <Button size="large" onClick={handleAndClose(onFullscreen)}>Toggle fullscreen</Button>
                <Button size="large" onClick={handleAndClose(onSettings)}>Settings...</Button>
                <Button size="large" onClick={handleAndClose(onEditWidgets)}>Edit widgets...</Button>
            </Stack>
        </Paper>
    );
}

export default observer(DashboardSelectorMenu);