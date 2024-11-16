import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Card, CardContent } from '@signalco/ui-primitives/Card';
import { slug } from '@signalco/js';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KeyFeature1 } from './KeyFeature1';
import { Ctas1 } from './Ctas1';

export function PricingCard1({ header, description, asset, features, ctas }: SectionData) {
    return (
        <Card>
            <CardContent className="h-full pt-6">
                <div className="grid h-full grid-rows-[auto_auto_1fr_auto_auto] gap-8">
                    <Stack spacing={2}>
                        <Row spacing={1} justifyContent="space-between">
                            <Typography level="h3" className="text-2xl" id={slug(header)}>{header}</Typography>
                            <Typography semiBold className="text-2xl">{asset}</Typography>
                        </Row>
                        <Typography level="body2">{description}</Typography>
                    </Stack>
                    {features ? <Divider /> : <div />}
                    <div>
                        {features && (
                            <div className="flex flex-col gap-6">
                                <Typography level="body1" secondary>Includes</Typography>
                                <div className="flex flex-col gap-2">
                                    {features.map((feature) => (
                                        <KeyFeature1 key={feature.header} {...feature} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <Divider />
                    <Ctas1 ctas={ctas} />
                </div>
            </CardContent>
        </Card>
    );
}
