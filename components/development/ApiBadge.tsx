import Chip from '@mui/joy/Chip';
import useIsClient from 'src/hooks/useIsClient';
import appSettingsProvider from '../../src/services/AppSettingsProvider';

export default function ApiBadge(props: { force?: 'dev' | 'prod', style?: React.CSSProperties }) {
    const { force, style } = props;

    const isClient = useIsClient();

    if (isClient && appSettingsProvider.isDeveloper) {
        return <Chip
            sx={{ ...style }}
            color={(force && force === 'prod') || (!force && appSettingsProvider.apiIsProduction) ? 'info' : 'warning'}
            size="sm">
            {(force && force === 'prod') || (!force && appSettingsProvider.apiIsProduction) ? 'prod' : 'dev'}
        </Chip>;
    }

    return null;
}
