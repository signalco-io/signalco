import React from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
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
        <div className="flex flex-col gap-2 sm:flex-row">
            {filters && <GalleryFilters filters={filters()} />}
            <Stack spacing={2} className="w-full">
                <GalleryGridFilter header={gridHeader} filters={gridFilters} />
                <GalleryGrid items={items} itemComponent={itemComponent} />
            </Stack>
        </div>
    );
}
