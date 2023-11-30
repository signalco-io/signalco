import { Fragment, PropsWithChildren, ReactNode } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Card, CardContent, CardTitle } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
import { Accordion } from '@signalco/ui/Accordion';
import { slug } from '@signalco/js';

export type SectionData = {
    tagline?: string;
    header?: string;
    description?: string;
    asset?: ReactNode;
    features?: SectionData[];
    ctas?: { label: string, href: string }[]
}

export function Heading1({ tagline, header, description, ctas, asset }: SectionData) {
    return (
        <Section1>
            <div className="flex flex-col gap-2">
                <Typography tertiary semiBold>{tagline}</Typography>
                <div className="flex flex-col gap-8">
                    <Typography level="h1" id={slug(header)}>{header}</Typography>
                    <Typography component="p">{description}</Typography>
                </div>
            </div>
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </Section1>
    )
}

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
    )
}

export function Feature2({ tagline, header, description, ctas, asset }: SectionData) {
    return (
        <Section1>
            <Description1 tagline={tagline} header={header} description={description} />
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </Section1>
    )
}

function KeyFeature1({ header, description, asset }: SectionData) {
    return (
        <div className="flex items-start gap-4">
            {asset && (
                <div className="pt-1">
                    {asset}
                </div>
            )}
            <div className="flex flex-col gap-3">
                <Typography level="h5" semiBold id={slug(header)}>{header}</Typography>
                <Typography>{description}</Typography>
            </div>
        </div>
    )
}

function KeyFeature2({ header, description, asset }: SectionData) {
    return (
        <div>
            {asset && (
                <div>
                    {asset}
                </div>
            )}
            <Typography level="h3" id={slug(header)} semiBold>{header}</Typography>
            <Typography>{description}</Typography>
        </div>
    )
}

function Ctas1({ ctas }: { ctas: SectionData['ctas'] }) {
    if (!ctas?.length) {
        return null;
    }

    return (
        <div>
            {ctas.map((cta, index) => (
                <Button
                    key={cta.label}
                    variant={index === 0 ? 'solid' : 'outlined'}
                    href={cta.href}
                    className="w-full">
                    {cta.label}
                </Button>
            ))}
        </div>
    )
}

function PricingCard1({ header, description, asset, features, ctas }: SectionData) {
    return (
        <Card>
            <CardContent className="flex flex-col gap-8 pt-6">
                <div className="flex justify-between gap-2">
                    <div className="flex flex-col gap-4">
                        <Typography level="h4" id={slug(header)}>{header}</Typography>
                        <Typography level="body2">{description}</Typography>
                    </div>
                    <Typography level="h3" component="p" semiBold>{asset}</Typography>
                </div>
                {features && (
                    <>
                        <Divider />
                        <div className="flex flex-col gap-6">
                            <div>Includes:</div>
                            <div className="flex flex-col gap-2">
                                {features.map((feature) => (
                                    <KeyFeature1 key={feature.header} {...feature} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
                <Divider />
                <Ctas1 ctas={ctas} />
            </CardContent>
        </Card>
    )
}

function Section1({children}: PropsWithChildren) {
    return (
        <section className="flex flex-col gap-10 p-4 py-12">
            {children}
        </section>
    )
}

function Description1({ tagline, header, description }: Pick<SectionData, 'tagline' | 'header' | 'description'>) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Typography level="body1" tertiary component="span" semiBold>{tagline}</Typography>
                <Typography level="h2" id={slug(header)}>{header}</Typography>
            </div>
            <Typography>{description}</Typography>
        </div>
    );
}


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
    )
}
