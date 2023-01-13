import React from 'react';
import { Stack as MuiStack } from '@mui/system';
import GalleryGridFilter from './GalleryGridFilter';
import GalleryGrid from './GalleryGrid';
import GalleryFilters from './GalleryFilters';
import Stack from '../Stack';

export interface GalleryProps {
    items: {
        id: string;
        label: string;
    }[];
    itemComponent: React.FunctionComponent<any>,
    filters?: () => React.ReactElement;
    gridHeader: string;
    gridFilters?: React.ReactElement;
}

export default function Gallery(props: GalleryProps) {
    const { items, itemComponent, filters, gridHeader, gridFilters } = props;

    return (
        <MuiStack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            {filters && <GalleryFilters filters={filters()} />}
            <Stack spacing={2} style={{ width: '100%' }}>
                <GalleryGridFilter header={gridHeader} filters={gridFilters} />
                <GalleryGrid items={items} itemComponent={itemComponent} />
            </Stack>
        </MuiStack>
    );
}
