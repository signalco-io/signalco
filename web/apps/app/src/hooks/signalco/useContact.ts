import { UseQueryResult, useQuery } from '@tanstack/react-query';
import type IContactPointer from '../../contacts/IContactPointer';
import IContact from '../../contacts/IContact';
import useContacts from './useContacts';
import useEntity from './entity/useEntity';

export function contactKey(pointer: Partial<IContactPointer> | null | undefined) {
    if (!pointer)
        return ['contact'];
    return ['contact', pointer.entityId, pointer.channelName, pointer.contactName];
}

export default function useContact(pointer: Partial<IContactPointer> | null | undefined) {
    const result = useContacts([pointer]);
    return {
        isLoading: result?.at(0)?.isLoading ?? false,
        isPending: result?.at(0)?.isPending ?? false,
        isStale: result?.at(0)?.isStale ?? false,
        error: result?.at(0)?.error,
        data: result?.at(0)?.data,
    }
}
