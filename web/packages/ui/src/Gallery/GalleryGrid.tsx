import React from 'react';

export type GalleryGridProps = {
    items: {
        id: string;
    }[];
    itemComponent: React.FunctionComponent<any>;
}

export function GalleryGrid(props: GalleryGridProps) {
    const { items, itemComponent } = props;
    const ItemComponent = itemComponent;
    return (
        <div className="grid grid-cols-4 gap-1">
            {items.map(item => (
                <ItemComponent key={item.id} {...item} />
            ))}
        </div>
    );
}
