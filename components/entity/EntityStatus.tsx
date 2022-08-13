import DotIndicator from 'components/shared/indicators/DotIndicator';
import { entityLastActivity, entityInError } from 'src/entity/EntityHelper';
import IEntityDetails from 'src/entity/IEntityDetails';

export default function EntityStatus(props: { entity: IEntityDetails | undefined }) {
    const { entity } = props;

    if (!entity || entity.type !== 1) return null;

    const isStale = new Date().getTime() - entityLastActivity(entity).getTime() > 24 * 60 * 60 * 1000;
    const isOffline = entityInError(entity);
    let statusColor: 'success' | 'warning' | 'error' = 'success';
    if (isOffline) statusColor = 'error';
    else if (isStale) statusColor = 'warning';

    return (
        <DotIndicator color={statusColor} />
    );
}
