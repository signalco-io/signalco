import { Stack } from '@signalco/ui-primitives/Stack';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';

export function QueryListSkeleton({ className, itemsCount = 5, itemClassName = 'h-5 w-full', spacing = 1 }: { className?: string, itemsCount?: number; itemClassName?: string; spacing?: number; }) {
    return (
        <Stack spacing={spacing} className={className}>
            {Array.from({ length: itemsCount }).map((_, i) => (
                <Skeleton key={i} className={itemClassName} />
            ))}
        </Stack>
    );
}
