import { useQueries, useQueryClient } from '@tanstack/react-query';
import IEntityDetails from '../entity/IEntityDetails';
import { entityAsync } from '../entity/EntityRepository';
import IContactPointer from '../contacts/IContactPointer';

export default function useContacts(pointers: IContactPointer[] | undefined) {
    const client = useQueryClient();
    return useQueries({
        queries: (pointers ?? []).map(pointer => {
            return {
                queryKey: ['contact', pointer.entityId, pointer.channelName, pointer.contactName],
                queryFn: async () => {
                    const entityKey = ['entity', pointer.entityId];
                    const entityQuery = client.getQueryState<IEntityDetails>(entityKey);
                    let entity: IEntityDetails | undefined = undefined;
                    if (entityQuery?.status === 'success')
                        entity = entityQuery.data;
                    if (!entity)
                        entity = await entityAsync(pointer.entityId);

                    const contact = entity.contacts?.find(c =>
                        c.channelName === pointer.channelName &&
                        c.contactName === pointer.contactName);
                    if (!contact)
                        throw new Error('Contact not found');
                    return contact;
                }
            }
        })
    });
}
