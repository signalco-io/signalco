import { Fragment } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Accordion } from '@signalco/ui/Accordion';
import { Ctas1 } from './subcomponents/Ctas1';
import { SectionData } from './SectionData';
import { Description1 } from './Description1';
import { Section1 } from './containers/Section1';


export function Faq1({ tagline, header, description, features, ctas }: SectionData) {
    return (
        <Section1>
            <Description1 tagline={tagline} header={header} description={description} />
            <Ctas1 ctas={ctas} />
            {features && (
                <div className="flex flex-col gap-2">
                    {features.map((feature, featureIndex) => (
                        <Fragment key={feature.header}>
                            {featureIndex > 0 && <Divider />}
                            <Accordion defaultOpen variant="plain">
                                <Typography semiBold>{feature.header}</Typography>
                                <p>{feature.description}</p>
                            </Accordion>
                        </Fragment>
                    ))}
                </div>
            )}
        </Section1>
    );
}
