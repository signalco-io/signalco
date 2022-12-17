'use client';

import { Chip, useIsClient } from '@signalco/ui';
import { signalcoApiEndpointIsProduction } from '../../src/services/AppSettingsProvider';
import { isDeveloper } from '../../src/services/EnvProvider';

export default function ApiBadge(props: { force?: 'dev' | 'prod' }) {
    const { force } = props;

    const isClient = useIsClient();

    if (isClient && isDeveloper) {
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
