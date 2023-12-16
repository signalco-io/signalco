import React from 'react';

export type GalleryItemComponent<TItem extends GalleryItem> = React.FunctionComponent<TItem>;

export type GalleryItem = {
    id: string;
};

export type GalleryGridProps<TItem extends GalleryItem> = {
    items: TItem[];
    itemComponent: GalleryItemComponent<TItem>;
}

export function GalleryGrid<TItem extends GalleryItem>(props: GalleryGridProps<TItem>) {
    const { items, itemComponent } = props;
    const ItemComponent = itemComponent;
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {items.map(item => (
                <ItemComponent key={item.id} {...item} />
            ))}
        </div>
    );
}
