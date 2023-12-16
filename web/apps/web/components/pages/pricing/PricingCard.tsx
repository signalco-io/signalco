import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Checkbox } from '@signalco/ui-primitives/Checkbox';
import { Card } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
import SignalcoLogotype from '../../icons/SignalcoLogotype';

export interface PricingOption {
    id: string,
    label: string,
    price: { eur: number },
    duration: 'forever' | 'month' | 'year',
    description: string,
    features: string[],
    href: string,
    hrefLabel: string
}

export interface PricingCardProps {
    option: PricingOption;
    variant: 'normal' | 'outlined' | 'inverted';
}

export default function PricingCard(props: PricingCardProps) {
    const { option } = props;

    const disabled = option.price.eur > 0;

    return (
        <Card className="h-full">
            <Stack
                className="h-full p-8"
                spacing={3}
                justifyContent="space-between">
                <Stack spacing={3}>
                    <Stack alignItems="center">
                        <SignalcoLogotype width={180} />
                        <Typography level="h3">{option.label}</Typography>
                    </Stack>
                    <Row alignItems="end" spacing={1}>
                        <Typography level="h5" component="p">€{option.price.eur}</Typography>
                        <Typography>/</Typography>
                        <Typography>{option.duration}</Typography>
                    </Row>
                    <Typography>{option.description}</Typography>
                    <Stack spacing={1}>
                        {option.features.map(feature => (
                            <Checkbox key={feature} defaultChecked readOnly label={feature} />
                        ))}
                    </Stack>
                </Stack>
                <Stack spacing={1}>
                    <Button
                        variant={option.id === 'basic' ? 'solid' : 'outlined'}
                        color={option.id === 'basic' ? 'primary' : 'neutral'}
                        disabled={disabled}
                        href={option.href}>
                        {disabled ? 'Available soon' : option.hrefLabel}
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
}
