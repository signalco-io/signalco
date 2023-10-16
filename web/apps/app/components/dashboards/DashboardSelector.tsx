'use client';

import { useEffect } from 'react';
import { Row } from '@signalco/ui/dist/Row';
import { Popper } from '@signalco/ui/dist/Popper';
import { ButtonDropdown } from '@signalco/ui/dist/ButtonDropdown';
import { Button } from '@signalco/ui/dist/Button';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { showNotification } from '../../src/notifications/PageNotificationService';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import DashboardSelectorMenu from './DashboardSelectorMenu';

type DashboardSelectorProps = {
    onEditWidgets: () => void,
    onSettings: () => void
}

function DashboardSelector(props: DashboardSelectorProps) {
    const { onEditWidgets, onSettings } = props;
    const [selectedId, setSelectedId] = useSearchParam('dashboard');
    const { data: dashboards, isLoading, error } = useDashboards();

    useEffect(() => {
        if (error) {
            console.error(error);
            showNotification('There was an error while loading dashboards. Please refresh the page.', 'error');
        }
    }, [error]);

    const currentDashboard = dashboards?.find(d => d.id == selectedId);
    const currentName = currentDashboard?.name;
    const favoriteDashboards = dashboards?.filter(d => d.isFavorite);

    // Set initial selection on component and dashboards load
    useEffect(() => {
        if (!selectedId && dashboards?.length && !isLoading) {
            console.debug('Selecting first available dashboard', dashboards[0].id);
            setSelectedId(dashboards[0].id);
        }
    }, [selectedId, dashboards, setSelectedId, isLoading]);

    return (
        <Row>
            {(dashboards?.length ?? 0) > 0 && (
                <Popper
                    trigger={(
                        <ButtonDropdown className="font-semibold">{currentName}</ButtonDropdown>
                    )}>
                    <DashboardSelectorMenu
                        selectedId={selectedId}
                        onSelection={setSelectedId}
                        onEditWidgets={onEditWidgets}
                        onSettings={onSettings} />
                </Popper>
            )}
            {(favoriteDashboards?.length ?? 0) > 0 && (
                <Row>
                    {favoriteDashboards?.map(fd => (
                        <Button
                            key={fd.id}
                            variant="plain"
                            onClick={() => setSelectedId(fd.id)}>
                            {fd.name}
                        </Button>
                    ))}
                </Row>
            )}
        </Row>
    );
}

export default DashboardSelector;
