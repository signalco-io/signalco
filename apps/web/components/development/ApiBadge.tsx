'use client';

import { Chip } from '@signalco/ui';
import useIsClient from 'src/hooks/useIsClient';
import appSettingsProvider from '../../src/services/AppSettingsProvider';

export default function ApiBadge(props: { force?: 'dev' | 'prod' }) {
    const { force } = props;

    const isClient = useIsClient();

    if (isClient && appSettingsProvider.isDeveloper) {
        return (
            <Chip
                color={(force && force === 'prod') || (!force && appSettingsProvider.apiIsProduction) ? 'info' : 'warning'}
                size="sm">
                {(force && force === 'prod') || (!force && appSettingsProvider.apiIsProduction) ? 'prod' : 'dev'}
            </Chip>
        );
    }

    return null;
}
