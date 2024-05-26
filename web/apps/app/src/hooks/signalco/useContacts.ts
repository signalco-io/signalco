import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import IEntityDetails from '../../entity/IEntityDetails';
import { entityAsync } from '../../entity/EntityRepository';
import IContactPointer from '../../contacts/IContactPointer';
import IContact from '../../contacts/IContact';

export default function useContacts(pointers: IContactPointer[] | undefined): UseQueryResult<IContact, Error>[] {
    const client = useQueryClient();
    return useQueries({
        queries: (pointers ?? []).filter(Boolean).map(pointer => {
            return {
                queryKey: ['contact', pointer.entityId, pointer.channelName, pointer.contactName],
                queryFn: async () => {
                    const entityKey = ['entity', pointer.entityId];
                    const entityQuery = client.getQueryState<IEntityDetails>(entityKey);
                    let entity: IEntityDetails | null | undefined = undefined;
                    if (entityQuery?.status === 'success' && !entityQuery.isInvalidated)
                        entity = entityQuery.data;
                    if (!entity)
                        entity = await entityAsync(pointer.entityId);

                    const contact = entity?.contacts?.find(c =>
                        c.channelName === pointer.channelName &&
                        c.contactName === pointer.contactName);

                    // TODO: Return `null` instead of throwing an error
                    if (!contact)
                        throw new Error('Contact not found');

                    return contact;
                },
                staleTime: 60 * 1000
            }
        })
    });
}
