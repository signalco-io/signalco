import { useMutation, useQueryClient } from '@tanstack/react-query';
import type IContactPointer from '../../contacts/IContactPointer';
import { setMetadataAsync } from '../../contacts/ContactRepository';
import { contactKey } from './useContact';
import { entityKey } from './entity/useEntity';
import { allEntitiesKey } from './entity/useAllEntities';

export default function useSetMetadataContact() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ pointer, metadataSerialized }: { pointer: IContactPointer, metadataSerialized: string | undefined }) =>
            setMetadataAsync(pointer, metadataSerialized),
        onSuccess: (_, vars) => {
            client.invalidateQueries({ queryKey: contactKey(vars.pointer) });
            client.invalidateQueries({ queryKey: allEntitiesKey() });
            client.invalidateQueries({ queryKey: entityKey(vars.pointer?.entityId) });
        }
    });
}
