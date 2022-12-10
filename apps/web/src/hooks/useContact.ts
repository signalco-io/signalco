import useEntity from './useEntity';
import IContactPointer from '../contacts/IContactPointer';

export default function useContact(pointer: IContactPointer | undefined) {
    const entity = useEntity(pointer?.entityId);
    const contact = entity.data?.contacts?.find(c =>
        c.channelName === pointer?.channelName &&
        c.contactName === pointer?.contactName);

    if (!entity.isLoading &&
        contact == null)
        throw new Error(`Unknown contact ${pointer?.entityId} | ${pointer?.channelName} | ${pointer?.contactName}`);

    return {
        isLoading: entity.isLoading,
        error: entity.error,
        data: contact
    };
}
