import compareVersions from 'compare-versions';
import { useLoadAndError } from '../../src/hooks/useLoadingAndError';
import useLocale, { useLocalePlaceholders } from '../../src/hooks/useLocale';
import StationsRepository from '../../src/stations/StationsRepository';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import { Button } from '@mui/material';
import { stationCommandAsync } from '../../pages/app/stations/[id]';

async function loadLatestAvailableVersion() {
    try {
        return await (await fetch('https://api.github.com/repos/signalco-io/station/releases/latest')).json();
    }
    catch (err) {
        console.warn('Failed to retrieve latest available version', err);
        throw err;
    }
}

export default function StationCheckUpdate(props: { stationId: string[] | string | undefined, stationVersion: string | undefined }) {
    const { t } = useLocale('App', 'Stations');
    const { t: tPlaceholder } = useLocalePlaceholders();

    const latestAvailableVersion = useLoadAndError(loadLatestAvailableVersion);
    const canUpdate = (!latestAvailableVersion.isLoading && !latestAvailableVersion.error && props.stationVersion)
        ? compareVersions(latestAvailableVersion.item.name?.replace('v', ''), props.stationVersion)
        : false;

    const handleUpdate = () => stationCommandAsync(props.stationId, StationsRepository.updateStationAsync, 'update station');

    return (
        <Button startIcon={canUpdate ? <UploadIcon /> : <CheckIcon />}
            variant="outlined"
            disabled={!canUpdate}
            onClick={handleUpdate}>
            {canUpdate && latestAvailableVersion
                ? t('UpdateStationVersion', { version: latestAvailableVersion.item.name ?? tPlaceholder('Unknown') })
                : t('UpdateStationUpToDate')}
        </Button>
    );
}

