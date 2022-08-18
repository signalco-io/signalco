import DotIndicator from 'components/shared/indicators/DotIndicator';
import { entityLastActivity, entityInError } from 'src/entity/EntityHelper';
import IEntityDetails from 'src/entity/IEntityDetails';
import BoltIcon from '@mui/icons-material/Bolt';

export default function EntityStatus(props: { entity: IEntityDetails | undefined }) {
    const { entity } = props;

    if (!entity || entity.type !== 1) return null;

    const isOffline = entityInError(entity);
    let statusColor: 'success' | 'warning' | 'error' = 'success';
    let content: React.ReactNode | undefined = undefined;
    if (isOffline) {
        statusColor = 'error';
        content = <BoltIcon fontSize="small" />;
    }
    else if (typeof isOffline === 'undefined') {
        const isStale = new Date().getTime() - entityLastActivity(entity).getTime() > 24 * 60 * 60 * 1000;
        if (isStale) statusColor = 'warning';
    }

    return (
        <DotIndicator color={statusColor} content={content} size={content ? 20 : undefined} />
    );
}
