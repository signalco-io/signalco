'use client';

import { useEffect, useState } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { ButtonDropdown } from '@signalco/ui-primitives/ButtonDropdown';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import DashboardSelectorMenu from './DashboardSelectorMenu';

type DashboardSelectorProps = {
    onEditWidgets: () => void,
    onSettings: () => void
}

function DashboardSelector({ onEditWidgets, onSettings }: DashboardSelectorProps) {
    const [selectedId, setSelectedId] = useSearchParam('dashboard');
    const [isOpen, setIsOpen] = useState(false);
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
            console.debug('Selecting first available dashboard', dashboards[0]?.id);
            setSelectedId(dashboards[0]?.id);
        }
    }, [selectedId, dashboards, setSelectedId, isLoading]);

    const handleSelection = (id: string) => {
        setSelectedId(id);
        setIsOpen(false);
    };

    const handleEditWidgets = () => {
        setIsOpen(false);
        onEditWidgets();
    };

    return (
        <Row>
            {(dashboards?.length ?? 0) > 0 && (
                <Popper
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    trigger={(
                        <ButtonDropdown className="font-semibold">{currentName}</ButtonDropdown>
                    )}>
                    <DashboardSelectorMenu
                        selectedId={selectedId}
                        onSelection={handleSelection}
                        onEditWidgets={handleEditWidgets}
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
