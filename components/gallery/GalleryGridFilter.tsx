import React from 'react';
import { Stack } from '@mui/system';
import { Typography } from '@mui/joy';

export interface GalleryGridFilterProps {
    header: string;
    filters?: React.ReactElement;
}

export default function GalleryGridFilter(props: GalleryGridFilterProps) {
    const { header, filters } = props;
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography gutterBottom level="h5">{header}</Typography>
            {filters}
        </Stack>
    );
}
