'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { camelToSentenceCase } from '@signalco/js';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useCurrentUser } from '../../../../../../../src/hooks/data/users/useCurrentUser';
import { useAccountPaymentMethods } from '../../../../../../../src/hooks/data/account/useAccountPaymentMethods';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';

export function PaymentSettingsCard() {
    const currentUser = useCurrentUser();
    const accountId = currentUser.data?.user?.accountIds[0];
    const billing = useAccountPaymentMethods(accountId);

    const defaultPaymentMethod = billing.data?.find(method => method.isDefault);

    return (
        <SettingsCard header="Payment Method">
            <Loadable
                isLoading={billing.isLoading || currentUser.isLoading}
                error={currentUser.error || billing.error}
                loadingLabel="Loading payment methods..."
                placeholder="skeletonText"
                width={300}>
                {defaultPaymentMethod ? (
                    <Typography level="body1">
                        Your payment method is <strong>{camelToSentenceCase(defaultPaymentMethod.displayBrand ?? '')}</strong> ending in <strong>****{defaultPaymentMethod.last4}</strong> expiring <strong>{defaultPaymentMethod.expMonth}/{defaultPaymentMethod.expYear}</strong>.
                    </Typography>
                ) : (
                    <Typography level="body1">
                        No payment method on file.
                    </Typography>
                )}
            </Loadable>
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
