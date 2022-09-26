import { useQuery } from '@tanstack/react-query';
import IContactPointer from 'src/contacts/IContactPointer';
import { contactAsync } from 'src/entity/EntityRepository';

export default function useContact(pointer: IContactPointer | undefined) {
    return useQuery(['contact', pointer?.entityId, pointer?.channelName, pointer?.contactName], () => {
        if (!pointer)
            throw new Error('Pointer is required for contact');
        return contactAsync(pointer);
    }, {
        enabled: Boolean(pointer)
    });
}
