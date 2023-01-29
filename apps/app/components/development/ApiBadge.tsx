'use client';

import { Chip } from '@signalco/ui';
import { useIsServer } from '@signalco/hooks';
import { isDeveloper } from '../../src/services/EnvProvider';
import { signalcoApiEndpointIsProduction } from '../../src/services/AppSettingsProvider';

export default function ApiBadge(props: { force?: 'dev' | 'prod' }) {
    const { force } = props;

    const isServer = useIsServer();

    if (!isServer && isDeveloper) {
        return (
            <Chip
                color={(force && force === 'prod') || (!force && signalcoApiEndpointIsProduction()) ? 'info' : 'warning'}
                size="sm">
                {(force && force === 'prod') || (!force && signalcoApiEndpointIsProduction()) ? 'prod' : 'dev'}
            </Chip>
        );
    }

    return null;
}
