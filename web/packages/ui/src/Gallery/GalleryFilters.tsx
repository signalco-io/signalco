import React from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';

export type GalleryFiltersProps = {
    filters: React.ReactElement;
}

export function GalleryFilters(props: GalleryFiltersProps) {
    const { filters } = props;
    return (
        <Stack className="h-fit w-full gap-1 md:max-w-[24%] md:gap-4">
            {filters}
        </Stack>
    );
}
