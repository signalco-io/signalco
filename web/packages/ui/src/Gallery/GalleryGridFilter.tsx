import { Typography } from '@mui/joy';
import React from 'react';
import {Row} from '../Row';

export type GalleryGridFilterProps = {
    header: string;
    filters?: React.ReactElement;
}

export function GalleryGridFilter(props: GalleryGridFilterProps) {
    const { header, filters } = props;
    return (
        <Row justifyContent="space-between" spacing={1}>
            <Typography gutterBottom level="h5">{header}</Typography>
            {filters}
        </Row>
    );
}
