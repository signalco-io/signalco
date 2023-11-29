import { Fragment, ReactNode } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Divider } from '@signalco/ui-primitives/Divider';
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

export function Heading1({ header, description, ctas, asset }: SectionData) {
    return (
        <div>
            <Typography level="h1" id={slug(header)}>{header}</Typography>
            <Typography level="h3" component="p">{description}</Typography>
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </div>
    )
}

export function Feature1({ tagline, header, description, ctas, asset, features }: SectionData) {
    return (
        <div>
            <Typography level="h6" component="span" uppercase>{tagline}</Typography>
            <Typography level="h2" id={slug(header)}>{header}</Typography>
            <Typography level="h3" component="p">{description}</Typography>
            {features && (
                <div>
                    {features.map((feature) => (
                        <KeyFeature2 key={feature.header} {...feature} />
                    ))}
                </div>
            )}
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </div>
    )
}

export function Feature2({ tagline, header, description, ctas, asset }: SectionData) {
    return (
        <div>
            <Typography level="h6" component="span" uppercase>{tagline}</Typography>
            <Typography level="h2" id={slug(header)}>{header}</Typography>
            <Typography level="h3" component="p">{description}</Typography>
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </div>
    )
}

function KeyFeature1({ header, description, asset }: SectionData) {
    return (
        <div>
            <div>
                {asset}
            </div>
            <Typography level="h3" id={slug(header)}>{header}</Typography>
            <Typography level="h4" component="p">{description}</Typography>
        </div>
    )
}

function KeyFeature2({ header, description, asset }: SectionData) {
    return (
        <div>
            <div>
                {asset}
            </div>
            <Typography level="h3" id={slug(header)}>{header}</Typography>
            <Typography level="h4" component="p">{description}</Typography>
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
                    href={cta.href}>
                    {cta.label}
                </Button>
            ))}
        </div>
    )
}

function PricingCard1({ header, description, asset, features, ctas }: SectionData) {
    return (
        <div>
            <div>
                <div>
                    <Typography level="h3" id={slug(header)}>{header}</Typography>
                    <Typography level="h4" component="p">{description}</Typography>
                </div>
                <Typography level="h1" component="p">{asset}</Typography>
            </div>
            {features && (
                <>
                    <Divider />
                    <div>Includes</div>
                    <div>
                        {features.map((feature) => (
                            <KeyFeature1 key={feature.header} {...feature} />
                        ))}
                    </div>
                </>
            )}
            <Divider />
            <Ctas1 ctas={ctas} />
        </div>
    )
}

export function Pricing1({ tagline, header, description, features }: SectionData) {
    const sharedFeatures = features?.at(0);
    const pricing = features?.at(1);
    return (
        <div>
            <Typography level="h6" component="span" uppercase>{tagline}</Typography>
            <Typography level="h2" id={slug(header)}>{header}</Typography>
            <Typography level="h3" component="p">{description}</Typography>
            {sharedFeatures?.features && (
                <div>
                    {sharedFeatures.features.map((feature) => (
                        <KeyFeature1 key={feature.header} {...feature} />
                    ))}
                </div>
            )}
            {pricing && (
                <PricingCard1 {...pricing} />
            )}
        </div>
    );
}

export function Faq1({ tagline, header, description, features }: SectionData) {
    return (
        <section className="p-4">
            <div>
                <Typography level="h6" component="span" uppercase>{tagline}</Typography>
                <Typography level="h2" id={slug(header)}>{header}</Typography>
                <Typography level="h3" component="p">{description}</Typography>
            </div>
            {features && (
                <div className="flex flex-col gap-2">
                    {features.map((feature, featureIndex) => (
                        <Fragment key={feature.header}>
                            {featureIndex > 0 && <Divider />}
                            <Accordion defaultOpen>
                                <p>{feature.header}</p>
                                <p>{feature.description}</p>
                            </Accordion>
                        </Fragment>
                    ))}
                </div>
            )}
        </section>
    )
}
