'use client';

import { useState } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { ButtonDropdown } from '@signalco/ui-primitives/ButtonDropdown';
import { Button } from '@signalco/ui-primitives/Button';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import useLocale from '../../src/hooks/useLocale';
import { useErrorNotification } from '../../src/hooks/useErrorNotification';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import { dashboardsGetFavorites } from '../../src/dashboards/DashboardsRepository';
import DashboardSelectorMenu from './DashboardSelectorMenu';

type DashboardSelectorProps = {
    onEditWidgets: () => void,
    onSettings: () => void
}

export function DashboardSelector({ onEditWidgets, onSettings }: DashboardSelectorProps) {
    const { t } = useLocale('App', 'Dashboards');
    const [selectedId, setSelectedId] = useSearchParam('dashboard');
    const [isOpen, setIsOpen] = useState(false);
    const { data: dashboards, isLoading: dashboardsIsLoading, error: dashboardsError } = useDashboards();
    useErrorNotification(dashboardsError, t('DashboardsLoadingError'));

    const currentDashboard = dashboards?.find(d => d.id == selectedId);
    const currentName = currentDashboard?.alias;
    const favoriteDashboardIds = dashboardsGetFavorites();
    const favoriteDashboards = dashboards?.filter(d => favoriteDashboardIds.includes(d.id));

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
                <div className="relative hidden overflow-x-auto [scroll-timeline:--scroll-timeline_x] [transform:translateZ(0)] md:block">
                    <Row>
                        {favoriteDashboards?.map(fd => (
                            <Button
                                key={fd.id}
                                variant="plain"
                                onClick={() => setSelectedId(fd.id)}
                                className="px-8 sm:px-5">
                                {fd.alias}
                            </Button>
                        ))}
                    </Row>
                </div>
            )}
        </Row>
    );
}
