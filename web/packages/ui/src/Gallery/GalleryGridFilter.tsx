import type { ReactElement } from 'react';
import { Typography } from '../Typography';
import { Row } from '../Row';

export type GalleryGridFilterProps = {
    header: string;
    filters?: ReactElement;
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
