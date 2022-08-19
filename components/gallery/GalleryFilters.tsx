import React from 'react';
import { Stack } from '@mui/material';

export interface GalleryFiltersProps {
    filters: React.ReactElement;
    compact?: boolean;
}

export default function GalleryFilters(props: GalleryFiltersProps) {
    const { filters, compact } = props;
    return (
        <Stack spacing={{ xs: 1, md: 4 }} sx={{
            padding: 0,
            width: '100%',
            maxWidth: compact ? undefined : '24%',
            height: 'fit-content'
        }}>
            {filters}
        </Stack>
    );
}
