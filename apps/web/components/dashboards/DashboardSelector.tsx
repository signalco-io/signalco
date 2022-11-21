import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { Select } from '@signalco/ui-icons';
import { Popper, Row, Stack, Button, Box } from '@signalco/ui';
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
            <Row>
                {(dashboards?.length ?? 0) > 0 && (
                    <Box>
                        <Button
                            variant="plain"
                            size="lg"
                            sx={{
                                '.JoyButton-endDecorator': {
                                    pointerEvents: 'none'
                                }
                            }}
                            endDecorator={<Select />} {...bindTrigger(popupState)}>
                            {currentName}
                        </Button>
                    </Box>
                )}
                {(favoriteDashboards?.length ?? 0) > 0 && (
                    <Row>
                        {favoriteDashboards?.map(fd => (
                            <Link key={fd.id} href={`#dashboard=${fd.id}`} passHref legacyBehavior>
                                <Button variant="plain" sx={{ color: 'var(--joy-palette-neutral-400)' }}>
                                    {fd.name}
                                </Button>
                            </Link>
                        ))}
                    </Row>
                )}
            </Row>
            <Popper popupState={popupState}>
                <DashboardSelectorMenu
                    selectedId={selectedId}
                    popupState={popupState}
                    onSelection={setSelectedIdHash}
                    onEditWidgets={onEditWidgets}
                    onSettings={onSettings} />
            </Popper>
        </Suspense>
    );
}

export default DashboardSelector;
