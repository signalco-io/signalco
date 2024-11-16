import { Fragment } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Accordion } from '@signalco/ui/Accordion';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Description1 } from '../Description/Description1';
import { Section2 } from '../containers/Section2';

export function Faq1({ tagline, header, description, features, ctas }: SectionData) {
    return (
        <Section2>
            <Stack spacing={6}>
                <Description1 tagline={tagline} header={header} description={description} />
                <Ctas1 ctas={ctas} />
            </Stack>
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
        </Section2>
    );
}
