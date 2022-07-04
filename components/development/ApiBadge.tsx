import { Chip } from '@mui/material';
import appSettingsProvider from '../../src/services/AppSettingsProvider';

export default function ApiBadge(props: { force?: 'dev' | 'prod', style?: React.CSSProperties }) {
    const { force, style } = props;

    if (appSettingsProvider.isDeveloper) {
        return <Chip
            sx={{ ...style }}
            color={force === 'prod' || appSettingsProvider.apiIsProduction ? 'info' : 'warning'}
            label={force === 'prod' || appSettingsProvider.apiIsProduction ? 'prod' : 'dev'}
            size="small" />;
    }

    return null;
}
