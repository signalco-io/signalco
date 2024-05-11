import { Stack } from '@signalco/ui-primitives/Stack';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KeyFeature1 } from '../subcomponents/KeyFeature1';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Description1 } from '../Description/Description1';
import { Section3 } from '../containers/Section3';

export function Feature3({ tagline, header, description, ctas, asset, features }: SectionData) {
    return (
        <Section3>
            <Stack spacing={8} alignItems="center">
                <Description1 tagline={tagline} header={header} description={description} />
                <Ctas1 ctas={ctas} />
                {asset && (
                    <div>
                        {asset}
                    </div>
                )}
            </Stack>
            {features && (
                <div className="grid grid-flow-col justify-center gap-10 md:gap-20">
                    {features.map((feature, i) => (
                        <KeyFeature1 key={feature.header ?? i} {...feature} />
                    ))}
                </div>
            )}
        </Section3>
    );
}
