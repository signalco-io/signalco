'use client';

import { useEffect, useState } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { ButtonDropdown } from '@signalco/ui-primitives/ButtonDropdown';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { Loadable } from '@signalco/ui/Loadable';
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
            <Loadable
                isLoading={isLoading}
                error={error}
                loadingLabel="Loading spaces..."
                placeholder="skeletonRect"
                height={30}
                width={120}>
                {(dashboards?.length ?? 0) > 0 && (
                    <Popper
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        trigger={(
                            <ButtonDropdown className="w-12 font-semibold sm:w-24 md:w-44">{currentName}</ButtonDropdown>
                        )}>
                        <DashboardSelectorMenu
                            selectedId={selectedId}
                            onSelection={handleSelection}
                            onEditWidgets={handleEditWidgets}
                            onSettings={onSettings} />
                    </Popper>
                )}
            </Loadable>
            {(favoriteDashboards?.length ?? 0) > 0 && (
                <div className="relative overflow-x-auto [scroll-timeline:--scroll-timeline_x] [transform:translateZ(0)]">
                    {/* <div className="fixed inset-y-0 left-0 h-full animate-scroll-overflow [animation-timeline:--scroll-timeline]">
                        <Left className="opacity-60" />
                    </div> */}
                    <Row>
                        {favoriteDashboards?.map(fd => (
                            <Button
                                key={fd.id}
                                variant="plain"
                                onClick={() => setSelectedId(fd.id)}
                                className="px-8 sm:px-5">
                                {fd.name}
                            </Button>
                        ))}
                    </Row>
                    {/* <div className="fixed inset-y-0 right-0 h-full animate-scroll-overflow [animation-direction:reverse]">
                        <Navigate className="opacity-60" />
                    </div> */}
                </div>
            )}
        </Row>
    );
}

export default DashboardSelector;
