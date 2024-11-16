import React, { useEffect, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import ConfirmDeleteButton from '../shared/dialog/ConfirmDeleteButton';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import useLocale from '../../src/hooks/useLocale';
import useSaveDashboard from '../../src/hooks/dashboards/useSaveDashboard';
import useDeleteDashboard from '../../src/hooks/dashboards/useDeleteDashboard';
import { Dashboard } from '../../src/dashboards/DashboardsRepository';
import { BackgroundSelector } from './BackgroundSelector';

export type DashboardSettingsProps = {
    isOpen: boolean,
    dashboard: Dashboard,
    onClose: () => void,
}

function DashboardSettings({ isOpen, dashboard, onClose }: DashboardSettingsProps) {
    const { t } = useLocale('App', 'Dashboards');
    const [name, setName] = useState(dashboard?.alias || '');
    const [background, setBackground] = useState(dashboard?.configuration.background);
    const [, setDashboardId] = useSearchParam('dashboard');
    const saveDashboard = useSaveDashboard();
    const deleteDashboard = useDeleteDashboard();

    const handleSave = async () => {
        await saveDashboard.mutateAsync({
            id: dashboard?.id,
            alias: name,
            configuration: dashboard?.configuration
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
            setName(dashboard.alias);
        }
    }, [dashboard]);

    return (
        <ConfigurationDialog
            open={isOpen}
            header={t('DashboardSettings')}
            onClose={onClose}
            actions={(
                <>
                    <Button onClick={onClose}>{t('Cancel')}</Button>
                    <Button autoFocus onClick={handleSave} loading={saveDashboard.isPending}>{t('SaveChanges')}</Button>
                </>
            )}>
            <Stack spacing={4}>
                <Input
                    label={t('DashboardSettingName')}
                    value={name}
                    onChange={(e) => setName(e.target.value ?? '')} />
                <Stack spacing={2}>
                    <Typography level="body2" semiBold>{t('Background')}</Typography>
                    <BackgroundSelector value={background} onChange={setBackground} />
                </Stack>
                <Stack spacing={1}>
                    <Typography level="body2" semiBold>{t('Advanced')}</Typography>
                    <ConfirmDeleteButton
                        buttonLabel={t('DeleteButtonLabel')}
                        header={t('DeleteTitle')}
                        expectedConfirmText={dashboard?.alias || t('ConfirmDialogExpectedText')}
                        onConfirm={handleDashboardDelete}
                    />
                </Stack>
            </Stack>
        </ConfigurationDialog>
    );
}

export default DashboardSettings;
