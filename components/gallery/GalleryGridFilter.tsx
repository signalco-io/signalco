import React from 'react';
import { Stack, Typography } from '@mui/material';

export interface GalleryGridFilterProps {
    header: string;
    filters?: React.ReactElement;
}

export default function GalleryGridFilter(props: GalleryGridFilterProps) {
    const { header, filters } = props;
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography gutterBottom variant="h3">{header}</Typography>
            {filters}
        </Stack>
    );
}
