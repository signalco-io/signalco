import { MuiStack, Stack, Button, Card, Typography, Checkbox, Row } from '@signalco/ui';
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
        <div>
            <Card
                sx={{
                    height: '100%'
                }}>
                <MuiStack
                    sx={{ height: '100%' }}
                    p={{ xs: 4, md: 6 }}
                    spacing={{ xs: 3, md: 4 }}
                    justifyContent="space-between">
                    <MuiStack spacing={{ xs: 3, md: 4 }}>
                        <Stack alignItems="center">
                            <SignalcoLogotype width={180} hideBadge />
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
                                <Checkbox key={feature} checked readonly label={feature} />
                            ))}
                        </Stack>
                    </MuiStack>
                    <Stack spacing={1}>
                        <Button
                            variant={option.id === 'basic' ? 'solid' : 'outlined'}
                            color={option.id === 'basic' ? 'primary' : 'neutral'}
                            disabled={disabled}
                            href={option.href}>
                            {disabled ? 'Available soon' : option.hrefLabel}
                        </Button>
                    </Stack>
                </MuiStack>
            </Card>
        </div>
    );
}
