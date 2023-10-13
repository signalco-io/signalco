import { useMutation, useQueryClient } from '@tanstack/react-query';
import type IContactPointer from '../../contacts/IContactPointer';
import { setMetadataAsync } from '../../contacts/ContactRepository';

export default function useSetMetadataContact() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ pointer, metadataSerialized }: { pointer: IContactPointer, metadataSerialized: string | undefined }) =>
            setMetadataAsync(pointer, metadataSerialized),
        onSuccess: (_, vars) => {
            client.invalidateQueries(['contact', vars.pointer?.entityId, vars.pointer?.channelName, vars.pointer?.contactName]);
            client.invalidateQueries(['entities']);
            client.invalidateQueries(['entities', 0]);
            client.invalidateQueries(['entities', 1]);
            client.invalidateQueries(['entities', 2]);
            client.invalidateQueries(['entities', 3]);
            client.invalidateQueries(['entities', 4]);
            client.invalidateQueries(['entity', vars.pointer?.entityId]);
        }
    });
}
