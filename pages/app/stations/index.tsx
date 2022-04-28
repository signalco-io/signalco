import { Typography, Stack } from '@mui/material';
import React from 'react';
import { AppLayoutWithAuth } from '../../../components/layouts/AppLayoutWithAuth';
import AutoTable, { IAutoTableItem } from '../../../components/shared/table/AutoTable';
import useAutoTable from '../../../components/shared/table/useAutoTable';
import StationsRepository, { IStationModel } from '../../../src/stations/StationsRepository';
import useLocale from '../../../src/hooks/useLocale';
import Timeago from '../../../components/shared/time/Timeago';

function stationModelToTableItem(station: IStationModel): IAutoTableItem {
    return {
        id: station.id,
        name: station.id,
        version: station.version ?? '-',
        lastActivity: <Timeago date={station.stateTimeStamp} />,
        registeredDate: <Timeago date={station.registeredTimeStamp} />,
        _link: `/app/stations/${station.id}`
    };
}

const StationsPage = () => {
    const { t } = useLocale('App', 'Stations');
    const stationsTable = useAutoTable(StationsRepository.getStationsAsync, stationModelToTableItem, t);

    return (
        <Stack spacing={{ xs: 0, sm: 4 }} sx={{ pt: { xs: 0, sm: 4 } }}>
            <Typography variant="h2" sx={{ visibility: { xs: 'hidden', sm: 'visible' } }}>{t('Stations')}</Typography>
            <AutoTable {...stationsTable} />
        </Stack>
    )
}

StationsPage.layout = AppLayoutWithAuth;

export default StationsPage;
