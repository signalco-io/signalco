'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { camelToSentenceCase } from '@signalco/js';
import { useAccountBilling } from '../../../../../../../src/hooks/data/account/useAccountUsage';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';

export function PaymentSettingsCard() {
    const billing = useAccountBilling();

    const defaultPaymentMethod = billing.data?.paymentMethods.find(method => method.default);

    return (
        <SettingsCard header="Payment Method">
            <Typography level="body1">
                Your payment method is <strong>{camelToSentenceCase(defaultPaymentMethod?.brand ?? '')} ending in {defaultPaymentMethod?.last4} expiring {defaultPaymentMethod?.expMonth}/{defaultPaymentMethod?.expYear}</strong>.
            </Typography>
            <SettingsCardActions className="justify-end">
                <NavigatingButton variant="solid" size="sm">Update Payment Methods</NavigatingButton>
            </SettingsCardActions>
        </SettingsCard>
    );
}
