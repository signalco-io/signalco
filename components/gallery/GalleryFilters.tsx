import React from 'react';
import { Stack } from '@mui/material';

export interface GalleryFiltersProps {
    filters: React.ReactElement;
    compact?: boolean;
}

export default function GalleryFilters(props: GalleryFiltersProps) {
    const { filters, compact } = props;
    return (
        <Stack spacing={4} sx={{ padding: 2, width: '100%', maxWidth: compact ? undefined : 360, height: 'fit-content' }}>
            {filters}
        </Stack>
    );
}
