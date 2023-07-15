import React from 'react';

export type GalleryItemComponent = <P>(props: P & {id: string}) => React.ReactElement;

export type GalleryGridProps = {
    items: {
        id: string;
    }[];
    itemComponent: GalleryItemComponent;
}

export function GalleryGrid(props: GalleryGridProps) {
    const { items, itemComponent } = props;
    const ItemComponent = itemComponent;
    return (
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map(item => (
                <ItemComponent key={item.id} {...item} />
            ))}
        </div>
    );
}
