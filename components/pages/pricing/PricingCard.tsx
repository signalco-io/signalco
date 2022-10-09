import { Stack } from '@mui/system';
import { Button, Card, Typography } from '@mui/joy';
import Checkbox from 'components/shared/form/Checkbox';
import SignalcoLogotype from 'components/icons/SignalcoLogotype';

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
    const { option, variant } = props;

    const disabled = option.price.eur > 0;

    return (
        <div>
            <Card
                sx={{
                    height: '100%'
                }}
                variant={variant === 'normal' ? 'plain' : (variant === 'inverted' ? 'solid' : 'soft')}>
                <Stack sx={{ p: { xs: 4, md: 6 }, height: '100%' }} spacing={{ xs: 3, md: 4 }} justifyContent="space-between">
                    <Stack spacing={{ xs: 3, md: 4 }}>
                        <Typography textAlign="center" level="h3" component="div">
                            <SignalcoLogotype width={180} hideBadge /> {option.label}
                        </Typography>
                        <Stack direction="row" alignItems="end" spacing={1}>
                            <Typography level="h5" component="p">€{option.price.eur}</Typography>
                            <Typography>/</Typography>
                            <Typography>{option.duration}</Typography>
                        </Stack>
                        <Typography>{option.description}</Typography>
                        <Stack spacing={1}>
                            {option.features.map(feature => (
                                <Checkbox key={feature} checked readonly label={feature} />
                            ))}
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <Button variant={option.id === 'basic' ? 'solid' : 'outlined'} color={option.id === 'basic' ? 'primary' : 'neutral'} disabled={disabled} href={option.href}>{option.hrefLabel}</Button>
                        {disabled && <Typography textColor="text.secondary" textAlign="center">Available soon</Typography>}
                        {option.price.eur <= 0 && <Typography textColor="text.secondary" textAlign="center">No credit card required</Typography>}
                    </Stack>
                </Stack>
            </Card>
        </div>
    );
}
