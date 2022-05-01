import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AppLayoutWithAuth } from '../../../../components/layouts/AppLayoutWithAuth';
import LogViewer, { useLog } from '../../../../components/logging/LogViewer';
import StationsRepository from '../../../../src/stations/StationsRepository';

export default function StationLog() {
    const router = useRouter();
    const { id } = router.query;
    const stationId = id ? id as string : undefined;

    const getStationLogsCallback = useMemo(() => stationId ? () => StationsRepository.getLogsAsync(stationId) : undefined, [stationId]);
    const log = useLog(stationId, getStationLogsCallback);

    return (
        <LogViewer height={500} {...log} />
    );
}

StationLog.layout = AppLayoutWithAuth;
