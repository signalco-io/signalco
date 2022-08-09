import React from 'react';
import { Grid } from '@mui/material';

export interface GalleryGridProps {
    items: {
        id: string;
    }[];
    itemComponent: React.FunctionComponent<any>;
    compact?: boolean;
}

export default function GalleryGrid(props: GalleryGridProps) {
    const { items, itemComponent, compact } = props;
    const ItemComponent = itemComponent;
    return (
        <div>
            <Grid container spacing={3} justifyContent={compact ? 'center' : 'start'}>
                {items.map(item => (
                    <Grid item key={item.id}>
                        <ItemComponent {...item} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
