import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { DocumentDto } from '../../app/api/dtos/dtos';
import { documentsKey } from './useDocuments';

export function documentKey(id?: string) {
    return [...documentsKey(), id];
}

async function fetchGetDocument(id: string) {
    const response = await fetch(`/api/documents/${id}`);
    if (response.status === 404)
        return null;
    return await response.json() as DocumentDto | undefined;
}

export function useDocument(id?: string): UseQueryResult<DocumentDto | null | undefined, Error> {
    return useQuery({
        queryKey: documentKey(id),
        queryFn: async () => {
            if (!id)
                throw new Error('Entity Id is required');
            return await fetchGetDocument(id);
        },
        enabled: id != null,
    })
}
