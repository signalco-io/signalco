import { Stack } from '@signalco/ui-primitives/Stack';
import { Card } from '@signalco/ui-primitives/Card';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KeyFeature2 } from '../subcomponents/KeyFeature2';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Description1 } from '../Description/Description1';
import { Section3 } from '../containers/Section3';

export function Feature4({ tagline, header, description, ctas, asset, features }: SectionData) {
    return (
        <Section3>
            <Card className="p-8 lg:p-12">
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
                    <div className="grid grid-flow-row gap-10 md:grid-flow-col md:justify-evenly md:gap-20">
                        {features.map((feature, i) => (
                            <KeyFeature2 key={feature.header ?? i} {...feature} />
                        ))}
                    </div>
                )}
            </Card>
        </Section3>
    );
}
