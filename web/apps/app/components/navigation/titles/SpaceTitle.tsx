'use client';

import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { DashboardSelector } from '../../dashboards/DashboardSelector';

export function SpaceTitle() {
    const [, setIsEditing] = useSearchParam('editing');
    const [, setIsDashboardSettingsOpen] = useSearchParam('settings');
    const handleEditWidgets = () => setIsEditing('true');
    const handleSettings = () => setIsDashboardSettingsOpen('true');

    return (
        <DashboardSelector
            onEditWidgets={handleEditWidgets}
            onSettings={handleSettings} />
    );
}
