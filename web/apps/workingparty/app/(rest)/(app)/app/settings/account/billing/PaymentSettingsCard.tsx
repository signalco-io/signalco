'use client';

import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useAccountPaymentMethods } from '../../../../../../../src/hooks/data/account/useAccountPaymentMethods';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';
import { User } from '../../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../../packages/auth-client/src/useCurrentUser';
import { PaymentMethodInfo } from './PaymentMethodInfo';

export function PaymentSettingsCard() {
    const currentUser = useCurrentUser<User>();
    const accountId = currentUser.data?.user?.accountIds[0];
    const billing = useAccountPaymentMethods(accountId);

    const paymentMethods = billing.data ?? [];

    return (
        <SettingsCard header="Payment Methods">
            <Loadable
                isLoading={billing.isLoading || currentUser.isLoading}
                error={currentUser.error || billing.error}
                loadingLabel="Loading payment methods..."
                placeholder="skeletonText"
                width={300}>
                <List spacing={1}>
                    {paymentMethods.map((paymentMethod) => (
                        <ListItem
                            key={paymentMethod.id}
                            className="pl-0"
                            label={(
                                <PaymentMethodInfo paymentMethod={paymentMethod} />
                            )}
                        />
                    ))}
                    {!paymentMethods.length && (
                        <ListItem label={'No payment method on file.'} />
                    )}
                </List>
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
