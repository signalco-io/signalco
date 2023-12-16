import { Typography } from '@signalco/ui-primitives/Typography';
import { slug } from '@signalco/js';
import { Ctas1 } from './subcomponents/Ctas1';
import { SectionData } from './SectionData';
import { Section1 } from './containers/Section1';

export function Heading1({ tagline, header, description, ctas, asset }: SectionData) {
    return (
        <Section1>
            <div className="flex flex-col gap-2">
                <Typography tertiary semiBold>{tagline}</Typography>
                <div className="flex flex-col gap-8">
                    <Typography level="h1" id={slug(header)}>{header}</Typography>
                    <Typography component="p">{description}</Typography>
                </div>
            </div>
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </Section1>
    )
}
