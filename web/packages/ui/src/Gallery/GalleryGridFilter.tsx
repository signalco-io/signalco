import type { ReactElement } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';

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
