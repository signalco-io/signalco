import { Typography } from '@signalco/ui-primitives/Typography';
import { slug } from '@signalco/js';
import { SectionData } from '../SectionData';

export function KeyFeature1({ header, description, asset }: SectionData) {
    return (
        <div className="flex items-start gap-4">
            {asset && (
                <div className="pt-1">
                    {asset}
                </div>
            )}
            <div className="flex flex-col gap-3">
                <Typography level="h6" semiBold id={slug(header)}>{header}</Typography>
                <Typography>{description}</Typography>
            </div>
        </div>
    );
}
