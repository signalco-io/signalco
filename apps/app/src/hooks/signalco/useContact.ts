import type IContactPointer from '../../contacts/IContactPointer';
import useEntity from './useEntity';

export default function useContact(pointer: Partial<IContactPointer> | undefined) {
    const entity = useEntity(pointer?.entityId);
    const contact = entity.data?.contacts?.find(c =>
        c.channelName === pointer?.channelName &&
        c.contactName === pointer?.contactName);

    if (!entity.isLoading &&
        contact == null)
        return {
            isError: true,
            error: `Unknown contact ${pointer?.entityId} | ${pointer?.channelName} | ${pointer?.contactName}`
        }

    return {
        isLoading: entity.isLoading,
        isError: entity.isError,
        error: entity.error,
        data: contact
    };
}
