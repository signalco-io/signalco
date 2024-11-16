'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Loadable } from '@signalco/ui/Loadable';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useAccountBillingInfo } from '../../../../../../../src/hooks/data/account/useAccountBillingInfo';
import { SettingsCardActions } from '../../../../../../../src/components/settings/SettingsCardActions';
import { SettingsCard } from '../../../../../../../src/components/settings/SettingsCard';
import { User } from '../../../../../../../src/components/providers/AppAuthProvider';
import { useCurrentUser } from '../../../../../../../../../packages/auth-client/src/useCurrentUser';

function BillingInfoSkeleton() {
    return (
        <Stack spacing={1}>
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-32" />
        </Stack>
    )
}

export function BillingInfoSettingsCard() {
    const currentUser = useCurrentUser<User>();
    const accountId = currentUser.data?.user?.accountIds[0];
    const billing = useAccountBillingInfo(accountId);

    return (
        <SettingsCard header="Billing Info">
            <Typography level="body1">
                Billing address that will be used for invoices and receipts.
            </Typography>
            <Loadable
                isLoading={billing.isLoading || currentUser.isLoading}
                error={currentUser.error || billing.error}
                loadingLabel="Loading payment methods..."
                placeholder={<BillingInfoSkeleton />}>
                <div>
                    <Typography level="body1" bold>
                        {billing.data?.line1}
                    </Typography>
                    {billing.data?.line2 && (
                        <Typography level="body1" bold>
                            {billing.data?.line2}
                        </Typography>
                    )}
                    {(billing.data?.city) && (
                        <Typography level="body1" bold>
                            {billing.data?.city}, {billing.data?.state} {billing.data?.postalCode}
                        </Typography>
                    )}
                    <Typography level="body1" bold>
                        {billing.data?.country}
                    </Typography>
                </div>
            </Loadable>
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
