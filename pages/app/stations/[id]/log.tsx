import { Divider, Paper, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { AppLayoutWithAuth } from '../../../../components/layouts/AppLayoutWithAuth';
import LogViewer, { useLog } from '../../../../components/logging/LogViewer';
import HttpService from '../../../../src/services/HttpService';
import StationsRepository from '../../../../src/stations/StationsRepository';
import IBlobInfoModel from '../../../../src/storage/IBlobInfoModel';

export default function StationLog() {
    const router = useRouter();
    const { id } = router.query;
    const stationId = id ? id as string : undefined;

    const getStationLogsCallback = useMemo(() => stationId ? () => StationsRepository.getLogsAsync(stationId) : undefined, [stationId]);
    const getStationLogBlob = useMemo(() => async (blob: IBlobInfoModel) => {
        const response = await HttpService.getAsync(`/stations/logging/download?stationId=${stationId}&blobName=${blob.name}`) as { fileContents: string };
        const contentBuffer = Buffer.from(response.fileContents, 'base64');
        return contentBuffer.toString('utf8');
    }, [stationId]);
    const log = useLog(stationId, getStationLogsCallback, getStationLogBlob);

    return (
        <Stack sx={{ p: 2 }} spacing={2}>
            <Stack spacing={1}>
                <Typography variant="overline">Logs</Typography>
                <Divider sx={{ maxWidth: '10%', backgroundColor: 'text.primary' }} />
                <Typography variant="h1" gutterBottom>{stationId}</Typography>
            </Stack>
            <LogViewer height={500} {...log} />
        </Stack>
    );
}

StationLog.layout = AppLayoutWithAuth;
