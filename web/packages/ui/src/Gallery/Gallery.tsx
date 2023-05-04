import React from 'react';
import {GalleryGridFilter} from './GalleryGridFilter';
import {GalleryGrid} from './GalleryGrid';
import {GalleryFilters} from './GalleryFilters';
import {Stack} from '../Stack';

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
        <div className="flex xs:flex-column md:flex-row gap-4">
            {filters && <GalleryFilters filters={filters()} />}
            <Stack spacing={2} style={{ width: '100%' }}>
                <GalleryGridFilter header={gridHeader} filters={gridFilters} />
                <GalleryGrid items={items} itemComponent={itemComponent} />
            </Stack>
        </div>
    );
}
