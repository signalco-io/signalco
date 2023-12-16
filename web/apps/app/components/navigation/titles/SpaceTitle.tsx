'use client';

import React from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import DashboardSelector from '../../dashboards/DashboardSelector';

export function SpaceTitle() {
    const [, setIsEditing] = useSearchParam('editing');
    const [, setIsDashboardSettingsOpen] = useSearchParam('settings');
    const handleEditWidgets = () => setIsEditing('true');
    const handleSettings = () => setIsDashboardSettingsOpen('true');

    return (
        <Row spacing={1} justifyContent="space-between" alignItems="stretch">
            <DashboardSelector
                onEditWidgets={handleEditWidgets}
                onSettings={handleSettings} />
        </Row>
    );
}
