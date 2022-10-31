import BoltIcon from '@mui/icons-material/Bolt';
import DateTimeProvider from 'src/services/DateTimeProvider';
import IEntityDetails from 'src/entity/IEntityDetails';
import { entityInError, entityLastActivity } from 'src/entity/EntityHelper';
import DotIndicator from 'components/shared/indicators/DotIndicator';
import { useMemo } from 'react';

export function useEntityStatus(entity: IEntityDetails | undefined) {
    const hasStatus = entity && entity.type === 1;
    const isOffline = useMemo(() => hasStatus ? entityInError(entity) : null, [entity, hasStatus]);
    const lastActivity = useMemo(() => hasStatus ? entityLastActivity(entity) : null, [entity, hasStatus]);
    const isStale = useMemo(() => (hasStatus && lastActivity) ? DateTimeProvider.now().getTime() - lastActivity.getTime() > 24 * 60 * 60 * 1000 : null, [lastActivity, hasStatus]);

    const result = useMemo(() => ({
        hasStatus,
        isOffline,
        lastActivity,
        isStale
    }), [isOffline, lastActivity, isStale]);

    return result;
}

type EntityStatusColors = 'success' | 'warning' | 'danger' | 'neutral';

export default function EntityStatus(props: { entity: IEntityDetails | undefined }) {
    const { hasStatus, isOffline, lastActivity, isStale } = useEntityStatus(props.entity);
    if (!hasStatus)
        return null;

    let statusColor: EntityStatusColors  = 'success';
    let content: React.ReactNode | undefined = undefined;
    if (isOffline) {
        statusColor = 'danger';
        content = <BoltIcon fontSize="small" />;
    }
    else if (isOffline == null) {
        if (!lastActivity) {
            statusColor = 'neutral';
        } else {
            if (isStale)
                statusColor = 'warning';
        }
    }

    return (
        <DotIndicator color={statusColor} content={content} size={content ? 20 : undefined} />
    );
}
