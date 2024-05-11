import { Stack } from '@signalco/ui-primitives/Stack';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KeyFeature1 } from '../subcomponents/KeyFeature1';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Description1 } from '../Description/Description1';
import { Section1 } from '../containers/Section1';

export function Feature2({ tagline, header, description, ctas, asset, features }: SectionData) {
    return (
        <Section1>
            <Stack spacing={8}>
            <Description1 tagline={tagline} header={header} description={description} />
                <Ctas1 ctas={ctas} />
                <div>
                    {asset}
                </div>
            </Stack>
            {features && (
                <div className="flex flex-col gap-8">
                    {features.map((feature, i) => (
                        <KeyFeature1 key={feature.header ?? i} {...feature} />
                    ))}
                </div>
            )}
        </Section1>
    );
}
