import React from 'react';
import { Stack } from '../Stack';

export type GalleryFiltersProps = {
    filters: React.ReactElement;
}

export function GalleryFilters(props: GalleryFiltersProps) {
    const { filters } = props;
    return (
        <Stack className="w-full md:max-w-[24%] h-fit gap-1 md:gap-4">
            {filters}
        </Stack>
    );
}
