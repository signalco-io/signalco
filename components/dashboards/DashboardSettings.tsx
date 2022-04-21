import { Button, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DashboardsRepository, { IDashboardModel } from '../../src/dashboards/DashboardsRepository';
import useLocale from '../../src/hooks/useLocale';
import ConfigurationDialog from '../shared/dialog/ConfigurationDialog';
import ConfirmDeleteButton from '../shared/dialog/ConfirmDeleteButton';

interface IDashboardSettingsProps {
    isOpen: boolean,
    dashboard?: IDashboardModel,
    onClose: () => void,
}

const DashboardSettings = (props: IDashboardSettingsProps) => {
    const { isOpen, dashboard, onClose } = props;
    const { t } = useLocale('App', 'Dashboards');
    const router = useRouter();
    const [name, setName] = useState(dashboard?.name || '');

    const handleSave = async () => {
        await DashboardsRepository.saveDashboardAsync(
            {
                ...dashboard,
                name: name
            }
        );
        onClose();
    }

    const handleDashboardDelete = async () => {
        if (dashboard) {
            await DashboardsRepository.deleteDashboardAsync(dashboard?.id);
            router.push({ hash: undefined });
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
            title={t('DashboardSettings')}
            onClose={onClose}
            actions={(
                <>
                    <Button onClick={onClose}>{t('Cancel')}</Button>
                    <Button autoFocus onClick={handleSave}>{t('SaveChanges')}</Button>
                </>
            )}>
            <Stack spacing={4} sx={{ py: 1 }}>
                <TextField label={t('DashboardSettingName')} value={name} onChange={(e) => setName(e.target.value ?? '')} />
                <Stack spacing={2}>
                    <Typography sx={{ opacity: 0.6 }} variant="subtitle2">{t('Advanced')}</Typography>
                    <ConfirmDeleteButton
                        buttonLabel={t('DeleteButtonLabel')}
                        title={t('DeleteTitle')}
                        expectedConfirmText={name || t('ConfirmDialogExpectedText')}
                        onConfirm={handleDashboardDelete} />
                </Stack>
            </Stack>
        </ConfigurationDialog>
    );
};

export default DashboardSettings;
