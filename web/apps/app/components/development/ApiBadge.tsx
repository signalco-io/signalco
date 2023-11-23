import { Chip } from '@signalco/ui-primitives/Chip';
import { useIsServer } from '@signalco/hooks/useIsServer';
import { isDeveloper } from '../../src/services/EnvProvider';
import { signalcoApiEndpointIsProduction } from '../../src/services/AppSettingsProvider';

export default function ApiBadge(props: { force?: 'dev' | 'prod' }) {
    const { force } = props;

    const isServer = useIsServer();

    if (isServer || !isDeveloper) {
        return null;
    }

    return (
        <Chip
            color={(force && force === 'prod') || (!force && signalcoApiEndpointIsProduction()) ? 'info' : 'warning'}
            size="sm">
            {(force && force === 'prod') || (!force && signalcoApiEndpointIsProduction()) ? 'prod' : 'dev'}
        </Chip>
    );
}
