import { Stack } from '@signalco/ui-primitives/Stack';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';

export function QueryListSkeleton({ itemsCount = 5, itemClassName = 'h-5 w-full', spacing = 1 }: { itemsCount?: number; itemClassName?: string; spacing?: number; }) {
    return (
        <Stack spacing={spacing}>
            {Array.from({ length: itemsCount }).map((_, i) => (
                <Skeleton key={i} className={itemClassName} />
            ))}
        </Stack>
    );
}
