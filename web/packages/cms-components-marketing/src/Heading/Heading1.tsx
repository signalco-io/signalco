import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { slug } from '@signalco/js';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Section1 } from '../containers/Section1';

export function Heading1({ tagline, header, description, ctas, asset }: SectionData) {
    return (
        <div className="md:my-8 lg:my-12 xl:my-24">
            <Section1>
                <Stack spacing={5}>
                    <Stack spacing={1}>
                        <Typography tertiary semiBold>{tagline}</Typography>
                        <Stack spacing={4}>
                            <Typography level="h1" id={slug(header)}>{header}</Typography>
                            {typeof description === 'string' ? <Typography component="p">{description}</Typography> : description}
                        </Stack>
                    </Stack>
                    <Ctas1 ctas={ctas} />
                </Stack>
                <div>
                    {asset}
                </div>
            </Section1>
        </div>
    )
}
