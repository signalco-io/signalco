'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { widgetType } from '../widgets/Widget';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import useLocale from '../../src/hooks/useLocale';
import useSaveDashboard from '../../src/hooks/dashboards/useSaveDashboard';
import useDashboard from '../../src/hooks/dashboards/useDashboard';
import { SpacesEditingBackground } from './SpacesEditingBackground';
import DashboardView from './DashboardView';
import { DashboardSkeleton } from './DashboardSkeleton';
import DashboardSettings from './DashboardSettings';
import { DashboardPadding } from './DashboardPadding';

const WidgetStoreDynamic = dynamic(() => import('../widget-store/WidgetStore'));

export const spaceBackgroundGradients: Record<string, string> = {
    blue: 'linear-gradient( 109.6deg,  rgba(0,51,102,1) 11.2%, #bbb 91.1% )',
    blue2: 'radial-gradient( circle farthest-corner at 1.8% 4.8%,  rgba(17,23,58,1) 0%, rgba(58,85,148,1) 90% )',
    purple: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90% )',
    redPurple: 'radial-gradient( circle farthest-corner at 48.4% 47.5%,  rgba(76,21,51,1) 0%, rgba(34,10,37,1) 90% )',
    moonshine: 'radial-gradient( circle 815px at 23.4% -21.8%,  rgba(9,29,85,1) 0.2%, rgba(0,0,0,1) 100.2% )',
    sunset: 'linear-gradient( 179deg,  rgba(0,0,0,1) 9.2%, rgba(127,16,16,1) 103.9% )',
    silver: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(90,92,106,1) 0%, rgba(32,45,58,1) 81.3% )',
    softGreen: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(176,229,208,1) 42%, rgba(92,202,238,0.41) 93.6% )',
    darkGreen: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90% )',
    softPink: 'radial-gradient( circle 879px at 10.4% 22.3%,  rgba(255,235,238,1) 0%, rgba(186,190,245,1) 93.6% )'
}

function SpaceBackground({ background }: { background?: string }) {
    const [currentGradient, setCurrentGradient] = useState<string | undefined>(undefined);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentGradient(background);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [background]);

    return (
        <>
            {(background && background !== currentGradient) && (
                <div
                    className="pointer-events-none fixed inset-0 -z-50 size-full"
                    style={{
                        backgroundImage: spaceBackgroundGradients[background]
                    }} />
            )}
            <div
                className={cx(
                    'pointer-events-none fixed inset-0 -z-50 h-full w-full',
                    background !== currentGradient && 'opacity-0 transition-opacity duration-500',
                    !currentGradient && 'bg-background'
                )}
                style={{
                    backgroundImage: currentGradient ? spaceBackgroundGradients[currentGradient] : undefined
                }} />
        </>
    );
}

export function Dashboards() {
    const { t } = useLocale('App', 'Dashboards');
    const [selectedId, setDashboardId] = useSearchParam('dashboard');
    const { data: selectedDashboard, isLoading: selectedDashboardIsLoading, error: selectedDashboardError } = useDashboard(selectedId);

    const saveDashboard = useSaveDashboard();
    const [isEditingValue, setIsEditing] = useSearchParam('editing');
    const isEditing = isEditingValue === 'true';
    const handleEditDone = async () => {
        if (!selectedDashboard) {
            console.warn('Can not save - dashboard not selected');
            return;
        }

        try {
            console.debug(`Saving dashboard ${selectedId}...`, selectedDashboard);
            await saveDashboard.mutateAsync(selectedDashboard);
        } catch (err) {
            console.error('Failed to save dashboards', err);
            showNotification(t('SaveFailedNotification'), 'error');
        } finally {
            setIsEditing(undefined);
        }
    };

    useEffect(() => {
        setIsEditing(undefined);
    }, [selectedId]);

    const handleNewDashboard = async () => {
        try {
            const newDashboardId = await saveDashboard.mutateAsync({
                alias: 'New dashboard'
            });
            setDashboardId(newDashboardId);
        } catch (err) {
            console.error('Failed to create dashboard', err);
            showNotification(t('NewDashboardErrorUnknown'), 'error');
        }
    };

    const [showWidgetStore, setShowWidgetStore] = useState(false);
    const handleAddWidget = useCallback((widgetType: widgetType) => {
        selectedDashboard?.configuration.widgets.push({
            id: 'new-widget',
            order: selectedDashboard.configuration.widgets.length,
            type: widgetType
        });
        setShowWidgetStore(false);
    }, [selectedDashboard?.configuration.widgets]);

    const handleAddWidgetPlaceholder = () => {
        setIsEditing('true');
        setShowWidgetStore(true);
    };

    const [isDashboardSettingsOpenValue, setIsDashboardSettingsOpen] = useSearchParam('settings');
    const isDashboardSettingsOpen = isDashboardSettingsOpenValue === 'true';

    const isLoading = Boolean(selectedId) && selectedDashboardIsLoading;

    // Handle 404
    if (!selectedDashboard && !selectedDashboardIsLoading) {
        return notFound();
    }

    return (
        <>
            <SpaceBackground background={selectedDashboard?.configuration.background} />
            {isEditing && (
                <>
                    <SpacesEditingBackground />
                    <Row>
                        <div className="xs:w-full px-2">
                            <Row spacing={1}>
                                <Button onClick={() => setShowWidgetStore(true)}>{t('AddWidget')}</Button>
                                <Button onClick={handleEditDone} fullWidth>{t('Save')}</Button>
                            </Row>
                        </div>
                    </Row>
                </>
            )}
            <Loadable
                isLoading={isLoading}
                placeholder={<DashboardSkeleton />}
                loadingLabel="Loading dashboard..."
                error={selectedDashboardError}>
                <DashboardPadding>
                    {selectedDashboard
                        ? (
                            <DashboardView
                                dashboard={selectedDashboard}
                                isEditing={isEditing}
                                onAddWidget={handleAddWidgetPlaceholder} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center">
                                <Row style={{ height: '80vh' }} justifyContent="center">
                                    <Stack style={{ maxWidth: 280 }} spacing={4} alignItems="center" justifyContent="center">
                                        <Image priority width={280} height={213} alt={t('NoDashboardsPlaceholder')} src="/assets/placeholders/placeholder-no-dashboards.svg" />
                                        <Typography level="h2">{t('NoDashboardsPlaceholder')}</Typography>
                                        <Typography center level="body2">{t('NoDashboardsHelpText')}</Typography>
                                        <Button variant="solid" onClick={handleNewDashboard}>{t('NewDashboard')}</Button>
                                    </Stack>
                                </Row>
                            </Stack>
                        )}
                </DashboardPadding>
            </Loadable>
            {selectedDashboard && (
                <DashboardSettings
                    dashboard={selectedDashboard}
                    isOpen={isDashboardSettingsOpen}
                    onClose={() => setIsDashboardSettingsOpen(undefined)} />
            )}
            <ConfigurationDialog open={showWidgetStore} onClose={() => setShowWidgetStore(false)} header={t('WidgetsStore')}>
                <WidgetStoreDynamic onAddWidget={handleAddWidget} />
            </ConfigurationDialog>
        </>
    );
}
