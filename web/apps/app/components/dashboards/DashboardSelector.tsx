'use client';

import { useEffect, useState } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { ButtonDropdown } from '@signalco/ui-primitives/ButtonDropdown';
import { Button } from '@signalco/ui-primitives/Button';
import { PageNotificationVariant, showNotification } from '@signalco/ui-notifications';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import useLocale from '../../src/hooks/useLocale';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import DashboardSelectorMenu from './DashboardSelectorMenu';

type DashboardSelectorProps = {
    onEditWidgets: () => void,
    onSettings: () => void
}

function useErrorNotification(error: Error | null, message: string, variant?: PageNotificationVariant) {
    useEffect(() => {
        if (error) {
            console.error(error);
            showNotification(message, variant ?? 'error');
        }
    }, [error, message, variant]);
}

function DashboardSelector({ onEditWidgets, onSettings }: DashboardSelectorProps) {
    const { t } = useLocale('App', 'Dashboards');
    const [selectedId, setSelectedId] = useSearchParam('dashboard');
    const [isOpen, setIsOpen] = useState(false);
    const { data: dashboards, isLoading: dashboardsIsLoading, error: dashboardsError } = useDashboards();
    useErrorNotification(dashboardsError, t('DashboardsLoadingError'));

    const currentDashboard = dashboards?.find(d => d.id == selectedId);
    const currentName = currentDashboard?.name;
    const favoriteDashboards = dashboards?.filter(d => d.isFavorite);

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
                isLoading={dashboardsIsLoading}
                error={dashboardsError}
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
                </div>
            )}
        </Row>
    );
}

export default DashboardSelector;
