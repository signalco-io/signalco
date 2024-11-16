import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { PricingCard1 } from '../subcomponents/PricingCard1';
import { KeyFeature1 } from '../subcomponents/KeyFeature1';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Description1 } from '../Description/Description1';
import { Section2 } from '../containers/Section2';

export function Pricing1({ tagline, header, description, features }: SectionData) {
    const sharedFeatures = features?.at(0);
    const pricing = features?.slice(1);
    return (
        <Section2>
            <Stack spacing={6}>
                <Description1 tagline={tagline} header={header} description={description} />
                <Stack spacing={6}>
                    {sharedFeatures?.features && (
                        <div className="flex flex-col gap-4">
                            {sharedFeatures.features.map((feature) => (
                                <KeyFeature1 key={feature.header} {...feature} />
                            ))}
                        </div>
                    )}
                    {sharedFeatures?.ctas && (
                        <Ctas1 ctas={sharedFeatures.ctas} />
                    )}
                </Stack>
            </Stack>
            <div className={cx('grid gap-4', Boolean((pricing?.length ?? 0) > 1) ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
                {pricing?.map((price, i) => (
                    <PricingCard1 key={i} {...price} />
                ))}
            </div>
        </Section2>
    );
}
