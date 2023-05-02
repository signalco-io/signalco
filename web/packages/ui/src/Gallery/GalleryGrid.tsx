import { Grid } from '@mui/joy';
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
        <div>
            <Grid container spacing={{ xs: 1, md: 3 }} justifyContent={{ xs: 'center', md: 'start' }}>
                {items.map(item => (
                    <Grid key={item.id}>
                        <ItemComponent {...item} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
