import { Typography } from '@signalco/ui-primitives/Typography';
import { slug } from '@signalco/js';
import { type SectionData } from '@signalco/cms-core/SectionData';

export function Description1({ tagline, header, description }: Pick<SectionData, 'tagline' | 'header' | 'description'>) {
    return (
        <div className="flex flex-col gap-6">
            {(tagline || header) && (
                <div className="flex flex-col gap-2">
                    {tagline && <Typography level="body1" tertiary component="span" semiBold>{tagline}</Typography>}
                    {header && <Typography level="h2" id={slug(header)}>{header}</Typography>}
                </div>
            )}
            {typeof description === 'string' ? <Typography className="text-balance">{description}</Typography> : description}
        </div>
    );
}
