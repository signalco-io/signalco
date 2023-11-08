import { useQuery } from '@tanstack/react-query';
import { Document } from '../lib/db/schema';

export function documentsKey() {
    return ['documents'];
}

async function fetchGetDocuments() {
    const response = await fetch('/api/documents');
    return await response.json() as Document[] | undefined;
}

export function useDocuments() {
    return useQuery({
        queryKey: documentsKey(),
        queryFn: fetchGetDocuments,
    })
}
