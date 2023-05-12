import React from 'react';
import { Stack } from '@mui/system';

export type GalleryFiltersProps = {
    filters: React.ReactElement;
}

export function GalleryFilters(props: GalleryFiltersProps) {
    const { filters } = props;
    return (
        <Stack spacing={{ xs: 1, md: 4 }} sx={{
            padding: 0,
            width: '100%',
            maxWidth: {xs: undefined, md: '24%'},
            height: 'fit-content'
        }}>
            {filters}
        </Stack>
    );
}
