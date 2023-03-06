import { useQuery } from '@tanstack/react-query';
import type IContactPointer from '../../contacts/IContactPointer';
import useEntity from './entity/useEntity';

export default function useContact(pointer: Partial<IContactPointer> | undefined) {
    const entity = useEntity(pointer?.entityId);

    return useQuery(['contact', pointer?.entityId, pointer?.channelName, pointer?.contactName], () => {
        if (!entity || !pointer?.channelName || !pointer?.contactName)
            throw new Error('EntityId, ChannelName and ContactName are required');

        const contact = entity.data?.contacts?.find(c =>
            c.channelName === pointer?.channelName &&
            c.contactName === pointer?.contactName);

        if (!contact)
            throw new Error('Contact not found');

        return contact;
    }, {
        enabled: Boolean(pointer) && Boolean(entity.data),
        staleTime: 60*1000
    });
}
