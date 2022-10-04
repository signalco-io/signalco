import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Box, Button, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useSaveDashboard from 'src/hooks/dashboards/useSaveDashboard';
import useDashboard from 'src/hooks/dashboards/useDashboard';
import DashboardView from './DashboardView';
import DashboardSettings from './DashboardSettings';
import DashboardSelector from './DashboardSelector';
import { widgetType } from '../widgets/Widget';
import Loadable from '../shared/Loadable/Loadable';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import PageNotificationService from '../../src/notifications/PageNotificationService';
import useLocale from '../../src/hooks/useLocale';
import useHashParam from '../../src/hooks/useHashParam';
import { WidgetModel } from '../../src/dashboards/DashboardsRepository';

const WidgetStoreDynamic = dynamic(() => import('../widget-store/WidgetStore'));

function Dashboards() {
    const { t } = useLocale('App', 'Dashboards');
    const [selectedId, setDashboardIdHash] = useHashParam('dashboard');
    const selectedDashboard = useDashboard(selectedId);
    const saveDashboard = useSaveDashboard();

    const [isEditing, setIsEditing] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const handleEditWidgets = useCallback(() => setIsEditing(true), []);
    const handleEditDone = async () => {
        if (!selectedDashboard.data) {
            console.warn('Can not save - dashboard not selected');
            return;
        }

        try {
            setIsSavingEdit(true);
            console.debug(`Saving dashboard ${selectedId}...`, selectedDashboard.data);
            await saveDashboard.mutateAsync(selectedDashboard.data);
        } catch (err) {
            console.error('Failed to save dashboards', err);
            PageNotificationService.show(t('SaveFailedNotification'), 'error');
        } finally {
            setIsEditing(false);
            setIsSavingEdit(false);
        }
    };

    useEffect(() => {
        setIsEditing(false);
    }, [selectedId]);

    const handleNewDashboard = async () => {
        try {
            const newDashboardId = await saveDashboard.mutateAsync({
                name: 'New dashboard'
            });
            setDashboardIdHash(newDashboardId);
        } catch (err) {
            console.error('Failed to create dashboard', err);
            PageNotificationService.show(t('NewDashboardErrorUnknown'), 'error');
        }
    };

    const [showWidgetStore, setShowWidgetStore] = useState(false);
    const handleAddWidget = useCallback((widgetType: widgetType) => {
        selectedDashboard.data?.widgets.push(new WidgetModel('new-widget', selectedDashboard.data.widgets.length, widgetType));
        setShowWidgetStore(false);
    }, [selectedDashboard.data?.widgets]);

    const handleAddWidgetPlaceholder = () => {
        setIsEditing(true);
        setShowWidgetStore(true);
    };

    const [isDashboardSettingsOpen, setIsDashboardSettingsOpen] = useState<boolean>(false);
    const handleSettings = useCallback(() => setIsDashboardSettingsOpen(true), []);

    console.debug('Rendering Dashboards');

    return (
        <>
            <Stack spacing={{ xs: 1, sm: 2 }} sx={{ pt: { xs: 0, sm: 2 } }}>
                <Stack spacing={1} direction={{ xs: 'column-reverse', md: 'row' }} justifyContent="space-between" alignItems="stretch">
                    <DashboardSelector
                        onEditWidgets={handleEditWidgets}
                        onSettings={handleSettings} />
                    {isEditing && (
                        <Box sx={{ px: 2, width: { md: 'auto', xs: '100%' } }}>
                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" size="large" onClick={() => setShowWidgetStore(true)} sx={{ width: '250px' }}>{t('AddWidget')}</Button>
                                <LoadingButton loading={isSavingEdit} variant="outlined" size="large" onClick={handleEditDone} fullWidth>{t('Save')}</LoadingButton>
                            </Stack>
                        </Box>
                    )}
                </Stack>
                <Loadable isLoading={selectedDashboard.isLoading} error={selectedDashboard.error}>
                    <Box sx={{ px: 2 }}>
                        {selectedDashboard.data
                            ? (
                                <DashboardView
                                    dashboard={selectedDashboard.data}
                                    isEditing={isEditing}
                                    onAddWidget={handleAddWidgetPlaceholder} />
                            ) : (
                                <Stack alignItems="center" justifyContent="center">
                                    <Stack sx={{ height: '80vh' }} alignItems="center" justifyContent="center" direction="row">
                                        <Stack maxWidth={280} spacing={4} alignItems="center" justifyContent="center">
                                            <Image priority width={280} height={213} alt={t('NoDashboardsPlaceholder')} src="/assets/placeholders/placeholder-no-dashboards.svg" />
                                            <Typography variant="h1">{t('NoDashboardsPlaceholder')}</Typography>
                                            <Typography textAlign="center" color="textSecondary">{t('NoDashboardsHelpText')}</Typography>
                                            <Button variant="contained" onClick={handleNewDashboard}>{t('NewDashboard')}</Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )}
                    </Box>
                </Loadable>
            </Stack>
            {isDashboardSettingsOpen && (
                <DashboardSettings
                    dashboard={selectedDashboard.data}
                    isOpen={isDashboardSettingsOpen}
                    onClose={() => setIsDashboardSettingsOpen(false)} />
            )}
            {showWidgetStore && (
                <ConfigurationDialog isOpen={showWidgetStore} onClose={() => setShowWidgetStore(false)} title={t('AddWidget')} maxWidth="lg">
                    <WidgetStoreDynamic onAddWidget={handleAddWidget} />
                </ConfigurationDialog>
            )}
        </>
    );
}

export default Dashboards;
