'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useCurrentUser } from '../../../../../../../src/hooks/data/users/useCurrentUser';
import { useAccountBilling } from '../../../../../../../src/hooks/data/account/useAccountBilling';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';

export function BillingInfoSettingsCard() {
    const currentUser = useCurrentUser();
    const accountId = currentUser.data?.user?.accountIds[0];
    const billing = useAccountBilling();

    return (
        <SettingsCard header="Billing Info">
            <div>
                <Typography level="body1">
                    Invoice will be named to <strong>{billing.data?.billingInfo.name}</strong>.
                </Typography>
                <Typography level="body1">
                    Billing address is <strong>{billing.data?.billingInfo.address}</strong>.
                </Typography>
            </div>
            <SettingsCardActions className="justify-end">
                <NavigatingButton
                    variant="solid"
                    size="sm"
                    disabled={!accountId}
                    href={KnownPages.AppSettingsAccountBillingPortal(accountId ?? 'unknown')}>Update Billing Info</NavigatingButton>
            </SettingsCardActions>
        </SettingsCard>
    );

}
