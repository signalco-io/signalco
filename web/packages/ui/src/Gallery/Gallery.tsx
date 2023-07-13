import React from 'react';
import {Stack} from '../Stack';
import {GalleryGridFilter} from './GalleryGridFilter';
import {GalleryGrid} from './GalleryGrid';
import {GalleryFilters} from './GalleryFilters';

export type GalleryProps = {
    items: {
        id: string;
        label: string;
    }[];
    itemComponent: React.FunctionComponent<any>,
    filters?: () => React.ReactElement;
    gridHeader: string;
    gridFilters?: React.ReactElement;
}

export function Gallery(props: GalleryProps) {
    const { items, itemComponent, filters, gridHeader, gridFilters } = props;

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {filters && <GalleryFilters filters={filters()} />}
            <Stack spacing={2} style={{ width: '100%' }}>
                <GalleryGridFilter header={gridHeader} filters={gridFilters} />
                <GalleryGrid items={items} itemComponent={itemComponent} />
            </Stack>
        </div>
    );
}
