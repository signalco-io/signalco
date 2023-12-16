import { KeyFeature2 } from './subcomponents/KeyFeature2';
import { Ctas1 } from './subcomponents/Ctas1';
import { SectionData } from './SectionData';
import { Description1 } from './Description1';
import { Section1 } from './containers/Section1';


export function Feature1({ tagline, header, description, ctas, asset, features }: SectionData) {
    return (
        <Section1>
            <Description1 tagline={tagline} header={header} description={description} />
            {features && (
                <div className="flex flex-col gap-8">
                    {features.map((feature) => (
                        <KeyFeature2 key={feature.header} {...feature} />
                    ))}
                </div>
            )}
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </Section1>
    );
}
