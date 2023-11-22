import { UseQueryResult, useQuery } from '@tanstack/react-query';
import type IContactPointer from '../../contacts/IContactPointer';
import IContact from '../../contacts/IContact';
import useEntity from './entity/useEntity';

export function contactKey(pointer: Partial<IContactPointer> | null | undefined) {
    if (!pointer)
        return ['contact'];
    return ['contact', pointer.entityId, pointer.channelName, pointer.contactName];
}

export default function useContact(pointer: Partial<IContactPointer> | null | undefined): UseQueryResult<IContact, Error> {
    const entity = useEntity(pointer?.entityId);

    return useQuery({
        queryKey: contactKey(pointer),
        queryFn: () => {
            if (!entity || !pointer?.channelName || !pointer?.contactName)
                throw new Error('EntityId, ChannelName and ContactName are required');

            const contact = entity.data?.contacts?.find(c =>
                c.channelName === pointer?.channelName &&
                c.contactName === pointer?.contactName);

            // TODO: Return `null` instead of throwing an error
            if (!contact)
                throw new Error(`Contact not found - ${pointer?.channelName}|${pointer?.contactName}`);

            return contact;
        },
        enabled: Boolean(pointer) && Boolean(entity.data) && !entity.isStale,
        staleTime: 60*1000
    });
}
