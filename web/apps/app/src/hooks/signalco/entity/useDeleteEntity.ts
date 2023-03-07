import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityDeleteAsync } from '../../../entity/EntityRepository';

export default function useDeleteEntity() {
    const client = useQueryClient();
    return useMutation((id: string) => {
        return entityDeleteAsync(id);
    }, {
        onSuccess: (id) => {
            client.invalidateQueries(['entities']);
            client.invalidateQueries(['entities', 0]);
            client.invalidateQueries(['entities', 1]);
            client.invalidateQueries(['entities', 2]);
            client.invalidateQueries(['entities', 3]);
            client.invalidateQueries(['entities', 4]);
            client.invalidateQueries(['entity', id]);
        }
    });
}
