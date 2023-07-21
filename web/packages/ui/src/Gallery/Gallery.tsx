import React from 'react';
import { Stack } from '../Stack';
import { GalleryGridFilter } from './GalleryGridFilter';
import { GalleryGrid, GalleryItem, GalleryItemComponent } from './GalleryGrid';
import { GalleryFilters } from './GalleryFilters';

export type GalleryProps<TItem extends GalleryItem> = {
    items: TItem[];
    itemComponent: GalleryItemComponent<TItem>,
    filters?: () => React.ReactElement;
    gridHeader: string;
    gridFilters?: React.ReactElement;
}

export function Gallery<TItem extends GalleryItem>(props: GalleryProps<TItem>) {
    const { items, itemComponent, filters, gridHeader, gridFilters } = props;

    return (
        <div className="flex flex-col gap-4 md:flex-row">
            {filters && <GalleryFilters filters={filters()} />}
            <Stack spacing={2} style={{ width: '100%' }}>
                <GalleryGridFilter header={gridHeader} filters={gridFilters} />
                <GalleryGrid items={items} itemComponent={itemComponent} />
            </Stack>
        </div>
    );
}
