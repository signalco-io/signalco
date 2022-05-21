import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import useAutoTable from '../../../components/shared/table/useAutoTable';
import { observer } from 'mobx-react-lite';
import ProcessesRepository, { IProcessModel, ProcessModel } from '../../../src/processes/ProcessesRepository';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import BlockSharpIcon from '@mui/icons-material/BlockSharp';
import useLocale from '../../../src/hooks/useLocale';
import { useRouter } from 'next/router';
import PageNotificationService from '../../../src/notifications/PageNotificationService';
import { LoadingButton } from '@mui/lab';

function deviceModelToTableItem(process: IProcessModel): IAutoTableItem {
    return {
        id: process.id,
        name: process.alias,
        enabled: !process.isDisabled ? <CheckSharpIcon /> : <BlockSharpIcon />,
        _link: `/app/processes/${process.id}`,
        _opacity: process.isDisabled ? 0.5 : 1
    };
}

const Processes = () => {
    const router = useRouter();
    const { t } = useLocale('App', 'Processes');
    const itemsTable = useAutoTable(ProcessesRepository.getProcessesAsync, deviceModelToTableItem, t);
    const [isCreating, setIsCreating] = useState(false);

    const handleNewProcess = async () => {
        try {
            setIsCreating(true);

            // Create new process
            const id = await ProcessesRepository.saveProcessAsync(ProcessModel.create());
            if (!id) {
                PageNotificationService.show(t('CreateFailed'), 'error');
                return;
            }

            // Navigate to created
            router.push(`/app/processes/${id}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Stack spacing={{ xs: 0, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Typography variant="h2" sx={{ visibility: { xs: 'hidden', sm: 'visible' } }}>{t('Processes')}</Typography>
            <Stack spacing={1} direction="row">
                <LoadingButton loading={isCreating} onClick={handleNewProcess}>{t('NewProcess')}</LoadingButton>
            </Stack>
            <AutoTable {...itemsTable} />
        </Stack>
    )
};

Processes.layout = AppLayoutWithAuth;

export default observer(Processes);
