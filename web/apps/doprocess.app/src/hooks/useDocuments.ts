import { useQuery } from '@tanstack/react-query';
import { DocumentDto } from '../../app/api/dtos/dtos';

export function documentsKey() {
    return ['documents'];
}

async function fetchGetDocuments() {
    const response = await fetch('/api/documents');
    return await response.json() as DocumentDto[] | undefined;
}

export function useDocuments() {
    return useQuery({
        queryKey: documentsKey(),
        queryFn: fetchGetDocuments,
    })
}
