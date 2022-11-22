import { useMemo } from 'react';
import { Lightning } from '@signalco/ui-icons';
import { DotIndicator } from '@signalco/ui';
import IEntityDetails from 'src/entity/IEntityDetails';
import { entityHasOffline, entityInError, entityLastActivity } from 'src/entity/EntityHelper';
import { now } from 'src/services/DateTimeProvider';

export function useEntityStatus(entity: IEntityDetails | undefined) {
    const hasStatus = entity && entity.type === 1;
    const isOffline = useMemo(() => hasStatus ? entityInError(entity) : null, [entity, hasStatus]);
    const hasOffline = useMemo(() => hasStatus ? entityHasOffline(entity) : null, [entity, hasStatus]);
    const lastActivity = useMemo(() => hasStatus ? entityLastActivity(entity) : null, [entity, hasStatus]);
    const isStale = useMemo(() => (hasStatus && lastActivity) ? now().getTime() - lastActivity.getTime() > 24 * 60 * 60 * 1000 : null, [lastActivity, hasStatus]);

    const result = useMemo(() => ({
        hasStatus,
        isOffline,
        hasOffline,
        lastActivity,
        isStale
    }), [hasStatus, isOffline, hasOffline, lastActivity, isStale]);

    return result;
}

type EntityStatusColors = 'success' | 'warning' | 'danger' | 'neutral';

export default function EntityStatus(props: { entity: IEntityDetails | undefined }) {
    const { hasStatus, isOffline, hasOffline, lastActivity, isStale } = useEntityStatus(props.entity);
    if (!hasStatus)
        return null;

    let statusColor: EntityStatusColors = 'success';
    let content: React.ReactNode | undefined = undefined;
    if (isOffline) {
        statusColor = 'danger';
        content = <Lightning size={16} />;
    }
    else if (!hasOffline) {
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
