import { Stack } from '@signalco/ui/Stack';
import { Skeleton } from '@signalco/ui/Skeleton';

export function EditorSkeleton() {
    return (
        <Stack spacing={1} className="px-[62px]">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
        </Stack>
    );
}
