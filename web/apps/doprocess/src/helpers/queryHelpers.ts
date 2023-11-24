import { QueryClient, QueryKey } from '@tanstack/react-query';

export async function handleOptimisticUpdate<T>(client: QueryClient, key: QueryKey, newItem: T) {
    await client.cancelQueries({ queryKey: key });
    const previousItem = client.getQueryData(key);
    if (previousItem) {
        client.setQueryData(key, (old: T) => ({ ...old, ...newItem }));
    }
    return previousItem;
}

export async function handleArrayOptimisticUpdate<T, TNew>(client: QueryClient, key: QueryKey, newItem: TNew, itemPredicate: (current: T) => boolean) {
    await client.cancelQueries({ queryKey: key });
    const previousItems = client.getQueryData(key);
    if (previousItems) {
        client.setQueryData(key, (old: T[]) => {
            return old.map((item: T) => itemPredicate(item)
                ? { ...item, ...newItem }
                : item
            );
        });
    }
    return previousItems;
}
