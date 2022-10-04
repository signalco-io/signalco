import BoltIcon from '@mui/icons-material/Bolt';
import DateTimeProvider from 'src/services/DateTimeProvider';
import IEntityDetails from 'src/entity/IEntityDetails';
import { entityInError, entityLastActivity } from 'src/entity/EntityHelper';
import DotIndicator from 'components/shared/indicators/DotIndicator';

export default function EntityStatus(props: { entity: IEntityDetails | undefined }) {
    const { entity } = props;

    if (!entity || entity.type !== 1) return null;

    const isOffline = entityInError(entity);
    let statusColor: 'success' | 'warning' | 'error' | 'grey' = 'success';
    let content: React.ReactNode | undefined = undefined;
    if (isOffline) {
        statusColor = 'error';
        content = <BoltIcon fontSize="small" />;
    }
    else if (typeof isOffline === 'undefined') {
        const lastActivity = entityLastActivity(entity);
        if (!lastActivity) {
            statusColor = 'grey';
        } else {
            const isStale = DateTimeProvider.now().getTime() - lastActivity.getTime() > 24 * 60 * 60 * 1000;
            if (isStale) statusColor = 'warning';
        }
    }

    return (
        <DotIndicator color={statusColor} content={content} size={content ? 20 : undefined} />
    );
}
