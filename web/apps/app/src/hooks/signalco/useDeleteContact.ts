import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import IContactPointer from '../../contacts/IContactPointer';
import { deleteContactAsync } from '../../../src/contacts/ContactRepository';
import { contactKey } from './useContact';
import { entityKey } from './entity/useEntities';
import { allEntitiesKey } from './entity/useAllEntities';

export default function useDeleteContact(): UseMutationResult<void, Error, IContactPointer, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: deleteContactAsync,
        onSuccess: (_, pointer) => {
            client.invalidateQueries({ queryKey: contactKey(pointer) });
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(pointer?.entityId) });
        }
    });
}
