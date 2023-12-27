import { Typography } from '@signalco/ui-primitives/Typography';
import { slug } from '@signalco/js';
import { type SectionData } from '@signalco/cms-core/SectionData';

export function KeyFeature2({ header, description, asset }: SectionData) {
    return (
        <div>
            {asset && (
                <div>
                    {asset}
                </div>
            )}
            <Typography level="h3" id={slug(header)} semiBold>{header}</Typography>
            <Typography>{description}</Typography>
        </div>
    );
}
