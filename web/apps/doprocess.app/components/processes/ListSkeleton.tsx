import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';

export function ListSkeleton({ itemsCount = 5, itemClassName = 'h-5 w-full', spacing = 1 }: { itemsCount?: number; itemClassName?: string; spacing?: number; }) {
    return (
        <Stack spacing={spacing}>
            {Array.from({ length: itemsCount }).map((_, i) => (
                <Skeleton key={i} className={itemClassName} />
            ))}
        </Stack>
    );
}
