import IContactPointer from '../../contacts/IContactPointer';
import { useEntities } from './entity/useEntities';

export default function useContacts(pointers: (Partial<IContactPointer> | null | undefined)[] | undefined) {
    const entities = useEntities(pointers?.map(p => p?.entityId));
    return entities.map((entity, index) => {
        const pointer = pointers?.[index];
        if (!entity.data || entity.isLoading || entity.isError || !pointer)
            return {
                isLoading: entity.isLoading,
                isPending: entity.isFetching,
                isStale: entity.isStale,
                error: entity.error,
                data: undefined
            };

        const contact = entity.data.contacts?.find(c =>
            c.channelName === pointer.channelName &&
            c.contactName === pointer.contactName);

        return {
            isLoading: entity.isLoading,
            isPending: entity.isFetching,
            isStale: entity.isStale,
            error: entity.error,
            data: contact
        };
    });
}
