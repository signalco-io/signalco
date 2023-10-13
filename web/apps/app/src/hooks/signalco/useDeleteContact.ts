import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteContactAsync } from '../../../src/contacts/ContactRepository';

export default function useDeleteContact() {
    const client = useQueryClient();
    return useMutation(deleteContactAsync, {
        onSuccess: (_, pointer) => {
            client.invalidateQueries(['contact', pointer?.entityId, pointer?.channelName, pointer?.contactName]);
            client.invalidateQueries(['entities']);
            client.invalidateQueries(['entities', 0]);
            client.invalidateQueries(['entities', 1]);
            client.invalidateQueries(['entities', 2]);
            client.invalidateQueries(['entities', 3]);
            client.invalidateQueries(['entities', 4]);
            client.invalidateQueries(['entity', pointer?.entityId]);
        }
    });
}
