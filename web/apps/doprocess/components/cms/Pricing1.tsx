import { PricingCard1 } from './subcomponents/PricingCard1';
import { KeyFeature1 } from './subcomponents/KeyFeature1';
import { SectionData } from './SectionData';
import { Description1 } from './Description1';
import { Section1 } from './containers/Section1';


export function Pricing1({ tagline, header, description, features }: SectionData) {
    const sharedFeatures = features?.at(0);
    const pricing = features?.at(1);
    return (
        <Section1>
            <Description1 tagline={tagline} header={header} description={description} />
            {sharedFeatures?.features && (
                <div className="flex flex-col gap-6">
                    {sharedFeatures.features.map((feature) => (
                        <KeyFeature1 key={feature.header} {...feature} />
                    ))}
                </div>
            )}
            {pricing && (
                <PricingCard1 {...pricing} />
            )}
        </Section1>
    );
}
