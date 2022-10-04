import { useContext } from 'react';
import { Button, Card, CardActionArea, Stack, ThemeProvider, Typography } from '@mui/material';
import theme from 'src/theme';
import { ThemeContext } from 'pages/_app';
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
    const themeContext = useContext(ThemeContext);
    const themeVariant = variant === 'inverted' ? (themeContext.isDark ? 'light' : 'dark') : (themeContext.theme ?? 'light');

    const disabled = option.price.eur > 0;

    return (
        <ThemeProvider theme={theme(themeVariant)}>
            <Card
                sx={{
                    bgcolor: variant === 'outlined' ? 'transparent' : undefined,
                    borderWidth: 3,
                    borderColor: 'text.primary',
                    borderRadius: 3
                }}
                variant={variant === 'normal' ? 'elevation' : 'outlined'}>
                <CardActionArea href={disabled ? '#' : option.href} sx={{ height: '100%' }} disabled={disabled}>
                    <Stack sx={{ p: { xs: 4, md: 6 }, height: '100%' }} spacing={{ xs: 3, md: 4 }} justifyContent="space-between">
                        <Stack spacing={{ xs: 3, md: 4 }}>
                            <Typography textAlign="center" fontWeight="bold" variant="h1" component="div">
                                <SignalcoLogotype theme={themeVariant} width={200} hideBadge /> {option.label}
                            </Typography>
                            <Stack direction="row" alignItems="end" spacing={1}>
                                <Typography variant="h2" fontWeight="bold" component="p">€{option.price.eur}</Typography>
                                <Typography>/</Typography>
                                <Typography>{option.duration}</Typography>
                            </Stack>
                            <Typography>{option.description}</Typography>
                            <Stack>
                                {option.features.map(feature => (
                                    <Stack key={feature}>
                                        <Checkbox checked readonly label={feature} />
                                    </Stack>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack spacing={1}>
                            <Button disableRipple variant="contained" disabled={option.price.eur > 0}>{option.hrefLabel}</Button>
                            {option.price.eur > 0 && <Typography color="textSecondary" textAlign="center">Available soon</Typography>}
                            {option.price.eur <= 0 && <Typography color="textSecondary" textAlign="center">No credit card required</Typography>}
                        </Stack>
                    </Stack>
                </CardActionArea>
            </Card>
        </ThemeProvider>
    );
}
