import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';

export function EditorSkeleton() {
    return (
        <Stack spacing={1} className="px-[62px]">
            <Skeleton className="h-7 w-[270px]" />
            <Skeleton className="h-7 w-[320px]" />
            <Skeleton className="h-7 w-[320px]" />
        </Stack>
    );
}
