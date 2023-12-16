import { Channel, Dashboard, Device, Play, Station } from '@signalco/ui-icons';
import { distinctBy } from '@signalco/js';
import ChannelLogo from '../../channels/ChannelLogo';
import IEntityDetails from '../../../src/entity/IEntityDetails';

export function EntityIconByType(entityOrType: IEntityDetails | number) {
    const type = typeof entityOrType === 'number' ? entityOrType : entityOrType.type;
    switch (type) {
    case 2:
        return <Dashboard />;
    case 3:
        return <Play />;
    case 4:
        return <Station />;
    case 5:
        if (typeof entityOrType === 'number')
            return <Channel />;

        const entityChannels = distinctBy(entityOrType.contacts.map(c => c.channelName), c => c);
        const onlyChannel = entityChannels[0];
        if (entityChannels.length === 1 && onlyChannel) {
            return function ChannelIcon() {
                return <ChannelLogo channelName={onlyChannel} />
            };
        }
        return <Channel />;
    default:
        return <Device />;
    }
}

export default function EntityIcon({ entity }: { entity: IEntityDetails | null | undefined }) {
    const Icon = null;

    if (entity && !Icon) {
        const EntityTypeIconOrFunc = EntityIconByType(entity);
        if (typeof EntityTypeIconOrFunc === 'function')
            return <EntityTypeIconOrFunc />;
        return EntityTypeIconOrFunc;
    }

    return Icon ?? <Device />;
}
