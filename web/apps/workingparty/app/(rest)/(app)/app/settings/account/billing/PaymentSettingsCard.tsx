'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { camelToSentenceCase } from '@signalco/js';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useCurrentUser } from '../../../../../../../src/hooks/data/users/useCurrentUser';
import { useAccountBilling } from '../../../../../../../src/hooks/data/account/useAccountBilling';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';

export function PaymentSettingsCard() {
    const currentUser = useCurrentUser();
    const accountId = currentUser.data?.user?.accountIds[0];
    const billing = useAccountBilling();

    const defaultPaymentMethod = billing.data?.paymentMethods.find(method => method.default);

    return (
        <SettingsCard header="Payment Method">
            <Typography level="body1">
                Your payment method is <strong>{camelToSentenceCase(defaultPaymentMethod?.brand ?? '')} ending in {defaultPaymentMethod?.last4} expiring {defaultPaymentMethod?.expMonth}/{defaultPaymentMethod?.expYear}</strong>.
            </Typography>
            <SettingsCardActions className="justify-end">
                <NavigatingButton
                    variant="solid"
                    size="sm"
                    disabled={!accountId}
                    href={KnownPages.AppSettingsAccountBillingPortal(accountId ?? 'unknown')}>
                    Update Payment Methods
                </NavigatingButton>
            </SettingsCardActions>
        </SettingsCard>
    );
}
