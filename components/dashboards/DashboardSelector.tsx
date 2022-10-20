import React, { Suspense, useEffect } from 'react';
import { bindPopover, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { Box, Stack } from '@mui/system';
import { Button, List, ListItem, ListItemButton } from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PopperUnstyled } from '@mui/base';
import useDashboards from 'src/hooks/dashboards/useDashboards';
import DashboardSelectorMenu from './DashboardSelectorMenu';
import useHashParam from '../../src/hooks/useHashParam';

export interface IDashboardSelectorProps {
    onEditWidgets: () => void,
    onSettings: () => void
}

function DashboardSelector(props: IDashboardSelectorProps) {
    const { onEditWidgets, onSettings } = props;
    const popupState = usePopupState({ variant: 'popover', popupId: 'dashboardsMenu' });
    const [selectedId, setSelectedIdHash] = useHashParam('dashboard');
    const { data: dashboards } = useDashboards();

    const currentDashboard = dashboards?.find(d => d.id == selectedId);
    const currentName = currentDashboard?.name;
    const favoriteDashboards = dashboards?.filter(d => d.isFavorite);

    // Set initial selection on component and dashboards load
    useEffect(() => {
        if (!selectedId && dashboards?.length) {
            console.log('Selecting first available dashboard', dashboards[0].id);
            setSelectedIdHash(dashboards[0].id);
        }
    }, [selectedId, dashboards, setSelectedIdHash]);

    console.debug('Rendering DashboardSelector');

    return (
        <Suspense>
            <Stack spacing={{ xs: 0, sm: 2 }} direction="row">
                {(dashboards?.length ?? 0) > 0 && (
                    <Box>
                        <Button variant="plain" size="lg" endDecorator={<KeyboardArrowDownIcon />} {...bindTrigger(popupState)}>
                            {currentName}
                        </Button>
                    </Box>
                )}
                {(favoriteDashboards?.length ?? 0) > 0 && (
                    <List row>
                        {favoriteDashboards?.map(fd => (
                            <ListItem key={fd.id}>
                                <ListItemButton href={`#dashboard=${fd.id}`}>{fd.name}</ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Stack>
            <PopperUnstyled {...bindPopover(popupState)}>
                <DashboardSelectorMenu
                    selectedId={selectedId}
                    popupState={popupState}
                    onSelection={setSelectedIdHash}
                    onEditWidgets={onEditWidgets}
                    onSettings={onSettings} />
            </PopperUnstyled>
        </Suspense>
    );
}

export default DashboardSelector;
