import { arrayMax } from 'src/helpers/ArrayHelpers'
import IEntityDetails from './IEntityDetails'

export function entityInError(entity: IEntityDetails | undefined) {
    if (typeof entity === 'undefined') return false;
    return !!entity.contacts.find(c => c.contactName === 'offline' && c.valueSerialized === 'true')
}

export function entityLastActivity(entity: IEntityDetails | undefined) {
    if (typeof entity === 'undefined') return new Date(0);
    return new Date(arrayMax(entity.contacts.map(c => c.timeStamp), d => d?.getTime() ?? 0) ?? 0)
}
