import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { slug } from '@signalco/js';
import { SectionData } from '../SectionData';

export function KeyFeature1({ header, description, asset }: SectionData) {
    return (
        <Row spacing={2}>
            {asset && (
                <div className="pt-1">
                    {asset}
                </div>
            )}
            <Stack spacing={1}>
                {header && <Typography semiBold id={slug(header)}>{header}</Typography>}
                {description && <Typography>{description}</Typography>}
            </Stack>
        </Row>
    );
}
