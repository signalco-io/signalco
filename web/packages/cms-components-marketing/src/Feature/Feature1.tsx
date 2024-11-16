import { Stack } from '@signalco/ui-primitives/Stack';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KeyFeature2 } from '../subcomponents/KeyFeature2';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Description1 } from '../Description/Description1';
import { Section2 } from '../containers/Section2';

export function Feature1({ tagline, header, description, ctas, asset, features }: SectionData) {
    return (
        <Section2>
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
                        <KeyFeature2 key={feature.header ?? i} {...feature} />
                    ))}
                </div>
            )}
        </Section2>
    );
}
