'use client';

import { PropsWithChildren, useEffect } from 'react';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import { DashboardSkeleton } from '../../components/dashboards/DashboardSkeleton';

export function DashboardsDefaultRedirect({ children }: PropsWithChildren) {
    const [selectedId, setDashboardId] = useSearchParam('dashboard');

    const { data: dashboards, isLoading: dashboardsIsLoading, error } = useDashboards();
    useEffect(() => {
        if (!selectedId && dashboards?.length && !dashboardsIsLoading) {
            console.debug('Selecting first available dashboard', dashboards[0]?.id);
            setDashboardId(dashboards[0]?.id);
        }
    }, [selectedId, dashboards, dashboardsIsLoading, setDashboardId]);

    const isLoading = !error && !selectedId && (dashboardsIsLoading || (dashboards?.length ?? 0) > 0);

    return (
        <Loadable
            isLoading={isLoading}
            placeholder={<DashboardSkeleton />}
            loadingLabel="Loading dashboards...">
            {children}
        </Loadable>
    );
}
