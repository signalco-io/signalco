import { Typography } from '@signalco/ui-primitives/Typography';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Card, CardContent } from '@signalco/ui-primitives/Card';
import { slug } from '@signalco/js';
import { SectionData } from '../SectionData';
import { KeyFeature1 } from './KeyFeature1';
import { Ctas1 } from './Ctas1';

export function PricingCard1({ header, description, asset, features, ctas }: SectionData) {
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
    );
}
