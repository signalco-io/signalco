import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@signalco/ui';
import { useSearchParam } from '@signalco/hooks';
import ConfirmDeleteButton from '../shared/dialog/ConfirmDeleteButton';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import useLocale from '../../src/hooks/useLocale';
import useSaveDashboard from '../../src/hooks/dashboards/useSaveDashboard';
import useDeleteDashboard from '../../src/hooks/dashboards/useDeleteDashboard';
import { IDashboardModel } from '../../src/dashboards/DashboardsRepository';

interface IDashboardSettingsProps {
    isOpen: boolean,
    dashboard?: IDashboardModel,
    onClose: () => void,
}

function DashboardSettings({ isOpen, dashboard, onClose }: IDashboardSettingsProps) {
    const { t } = useLocale('App', 'Dashboards');
    const [name, setName] = useState(dashboard?.name || '');
    const [, setDashboardId] = useSearchParam('dashboard');
    const saveDashboard = useSaveDashboard();
    const deleteDashboard = useDeleteDashboard();

    const handleSave = async () => {
        saveDashboard.mutate({
            ...dashboard,
            name: name
        });
        onClose();
    }

    const handleDashboardDelete = async () => {
        if (dashboard) {
            await deleteDashboard.mutateAsync(dashboard.id);
            setDashboardId(undefined);
        }
        onClose();
    }

    useEffect(() => {
        if (dashboard) {
            setName(dashboard.name);
        }
    }, [dashboard]);

    return (
        <ConfigurationDialog
            isOpen={isOpen}
            header={t('DashboardSettings')}
            onClose={onClose}
            actions={(
                <>
                    <Button onClick={onClose}>{t('Cancel')}</Button>
                    <Button autoFocus onClick={handleSave}>{t('SaveChanges')}</Button>
                </>
            )}>
            <Stack spacing={4}>
                <TextField
                    label={t('DashboardSettingName')}
                    value={name}
                    onChange={(e) => setName(e.target.value ?? '')} />
                <Stack spacing={1}>
                    <Typography level="body2">{t('Advanced')}</Typography>
                    <ConfirmDeleteButton
                        buttonLabel={t('DeleteButtonLabel')}
                        header={t('DeleteTitle')}
                        expectedConfirmText={dashboard?.name || t('ConfirmDialogExpectedText')}
                        onConfirm={handleDashboardDelete} />
                </Stack>
            </Stack>
        </ConfigurationDialog>
    );
}

export default DashboardSettings;
