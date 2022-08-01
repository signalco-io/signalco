import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import DashboardsRepository, { WidgetModel } from '../../src/dashboards/DashboardsRepository';
import PageNotificationService from '../../src/notifications/PageNotificationService';
import DashboardView from './DashboardView';
import DashboardSelector from './DashboardSelector';
import DashboardSettings from './DashboardSettings';
import { LoadingButton } from '@mui/lab';
import { widgetType } from '../widgets/Widget';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import useHashParam from '../../src/hooks/useHashParam';
import useDashboardsUpdateChecker from './useDashboardsUpdateChecker';
import useLocale from '../../src/hooks/useLocale';
import Loadable from '../shared/Loadable/Loadable';
import useLoadAndError from 'src/hooks/useLoadAndError';

const WidgetStoreDynamic = dynamic(() => import('../widget-store/WidgetStore'));

const Dashboards = observer(() => {
    const { t } = useLocale('App', 'Dashboards');
    const [selectedId, setDashboardIdHash] = useHashParam('dashboard');
    const retrieveDashbaord = useCallback(() => {
        return DashboardsRepository.getAsync(selectedId);
    }, [selectedId]);
    const selectedDashboard = useLoadAndError(retrieveDashbaord);

    useDashboardsUpdateChecker();

    const [isEditing, setIsEditing] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const handleEditWidgets = useCallback(() => setIsEditing(true), []);
    const handleEditDone = async () => {
        try {
            setIsSavingEdit(true);
            const updatedDashboards = [];
            for (let i = 0; i < DashboardsRepository.dashboards.length; i++) {
                const dashboard = DashboardsRepository.dashboards[i];
                updatedDashboards.push({
                    ...dashboard,
                    configurationSerialized: JSON.stringify({
                        widgets: dashboard.widgets
                    })
                });
            }
            console.debug('Saving dashboards...', updatedDashboards);
            await DashboardsRepository.saveDashboardsAsync(updatedDashboards);
        } catch (err) {
            console.error('Failed to save dashboards', err);
            PageNotificationService.show(t('SaveFailedNotification'), 'error');
        } finally {
            setIsEditing(false);
            setIsSavingEdit(false);
        }
    };

    const handleNewDashboard = async () => {
        const newDashboardId = await DashboardsRepository.saveDashboardAsync({
            name: 'New dashboard'
        });
        setDashboardIdHash(newDashboardId);
    };

    const [showWidgetStore, setShowWidgetStore] = useState(false);
    const handleAddWidget = useCallback((widgetType: widgetType) => {
        selectedDashboard.item?.widgets.push(new WidgetModel('new-widget', selectedDashboard.item.widgets.length, widgetType));
        setShowWidgetStore(false);
    }, [selectedDashboard.item?.widgets]);

    const handleAddWidgetPlaceholder = () => {
        setIsEditing(true);
        setShowWidgetStore(true);
    }

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
                        {selectedDashboard.item
                            ? (
                                <DashboardView
                                    dashboard={selectedDashboard.item}
                                    isEditing={isEditing}
                                    onAddWidget={handleAddWidgetPlaceholder} />
                            ) : (
                                <Stack alignItems="center" justifyContent="center">
                                    <Stack sx={{ height: '80vh' }} alignItems="center" justifyContent="center" direction="row">
                                        <Stack maxWidth={280} spacing={4} alignItems="center" justifyContent="center">
                                            <Image priority width={280} height={213} alt={t('NoDashboardsPlaceholder')} src="/assets/placeholders/placeholder-no-dashboards.svg" />
                                            <Typography variant="h1">{t('NoDashboardsPlaceholder')}</Typography>
                                            <Typography textAlign="center" color="textSecondary">{t('NoDashboardsHelpText')}</Typography>
                                            <Button variant="contained" onClick={handleNewDashboard}>{t('NewDahsboard')}</Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )}
                    </Box>
                </Loadable>
            </Stack>
            {isDashboardSettingsOpen && (
                <DashboardSettings
                    dashboard={selectedDashboard.item}
                    isOpen={isDashboardSettingsOpen}
                    onClose={() => setIsDashboardSettingsOpen(false)} />
            )}
            {showWidgetStore && (
                <ConfigurationDialog isOpen={showWidgetStore} onClose={() => setShowWidgetStore(false)} title={t('AddWidget')} maxWidth="lg" >
                    <WidgetStoreDynamic onAddWidget={handleAddWidget} />
                </ConfigurationDialog>
            )}
        </>
    );
});

export default Dashboards;
