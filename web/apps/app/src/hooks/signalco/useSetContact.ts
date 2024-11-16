import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import type IContactPointer from '../../contacts/IContactPointer';
import { setAsync } from '../../../src/contacts/ContactRepository';
import { contactKey } from './useContact';
import { entityKey } from './entity/useEntities';
import { allEntitiesKey } from './entity/useAllEntities';

export default function useSetContact(): UseMutationResult<void, Error, {
    pointer: IContactPointer;
    valueSerialized: string | undefined;
}, unknown> {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ pointer, valueSerialized }: { pointer: IContactPointer, valueSerialized: string | undefined }) =>
            setAsync(pointer, valueSerialized),
        onSuccess: (_, vars) => {
            client.invalidateQueries({ queryKey: contactKey(vars.pointer) });
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(vars.pointer?.entityId) });
        }
    });
}
