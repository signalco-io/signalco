import React from 'react';
import { Stack } from '../Stack';

export type GalleryFiltersProps = {
    filters: React.ReactElement;
}

export function GalleryFilters(props: GalleryFiltersProps) {
    const { filters } = props;
    return (
        <Stack className="uitw-h-fit uitw-w-full uitw-gap-1 md:uitw-max-w-[24%] md:uitw-gap-4">
            {filters}
        </Stack>
    );
}
