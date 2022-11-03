import { compareVersions } from 'compare-versions';
import { Button } from '@mui/joy';
import PageNotificationService from 'src/notifications/PageNotificationService';
import useLoadAndError from 'src/hooks/useLoadAndError';
import { Check, Upload } from 'components/shared/Icons';
import StationsRepository from '../../src/stations/StationsRepository';
import useLocale, { localizer, useLocalePlaceholders } from '../../src/hooks/useLocale';

async function loadLatestAvailableVersion() {
    try {
        return await (await fetch('https://api.github.com/repos/signalco-io/station/releases/latest')).json();
    }
    catch (err) {
        console.warn('Failed to retrieve latest available version', err);
        throw err;
    }
}

// TODO: Use generic command dispatch with state and error handling
const stationCommandAsync = async (stationId: string | string[] | undefined, command: (id: string) => Promise<void>, commandDescription: string) => {
    try {
        if (stationId == null ||
            typeof stationId !== 'string')
            throw Error('Station identifier not available. Can\'t ' + commandDescription);

        await command(stationId);
    }
    catch (err) {
        console.error('Station command execution error', err);
        PageNotificationService.show(localizer('App', 'Stations')('StationCommandError'), 'error');
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
        <Button
            startDecorator={canUpdate ? <Upload /> : <Check />}
            variant="outlined"
            disabled={!canUpdate}
            onClick={handleUpdate}>
            {canUpdate && latestAvailableVersion
                ? t('UpdateStationVersion', { version: latestAvailableVersion.item.name ?? tPlaceholder('Unknown') })
                : t('UpdateStationUpToDate')}
        </Button>
    );
}

