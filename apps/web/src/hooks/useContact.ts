import { useQuery, useQueryClient } from '@tanstack/react-query';
import IEntityDetails from '../entity/IEntityDetails';
import { entityAsync } from '../entity/EntityRepository';
import IContactPointer from '../contacts/IContactPointer';

export default function useContact(pointer: IContactPointer | undefined) {
    const client = useQueryClient();
    return useQuery(['contact', pointer?.entityId, pointer?.channelName, pointer?.contactName], async () => {
        if (!pointer)
            throw new Error('Pointer is required for contact');

        const entity = await entityAsync(pointer.entityId);
        const contact = entity.contacts?.find(c => c.channelName === pointer.channelName && c.contactName === pointer.contactName);
        if (contact == null)
            throw new Error(`Unknown contact ${pointer.entityId} | ${pointer.channelName} | ${pointer.contactName}`);

        return contact;
    }, {
        enabled: Boolean(pointer) && Boolean(pointer?.entityId),
        retry: false,
        staleTime: 60*1000,
        initialData: () => client.getQueryData<IEntityDetails>(['entity', pointer?.entityId])?.contacts?.find(c => c.entityId === pointer?.entityId && c.channelName === pointer?.channelName && c.contactName === pointer?.contactName),
        initialDataUpdatedAt: () => client.getQueryState(['entity', pointer?.entityId])?.dataUpdatedAt,
    });
}
