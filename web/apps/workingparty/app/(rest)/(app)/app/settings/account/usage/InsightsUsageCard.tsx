'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Divider } from '@signalco/ui-primitives/Divider';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { KnownPages } from '../../../../../../../src/knownPages';
import { useAccountUsage } from '../../../../../../../src/hooks/data/account/useAccountUsage';
import { UsageCard } from './UsageCard';
import { InsightsItem } from './InsightsItem';

export function InsightsUsageCard() {
    const usage = useAccountUsage();

    return (
        <UsageCard>
            <div className="-m-8 grid grid-cols-[1fr_auto_1fr_auto_1fr] grid-rows-[auto_auto_1fr]">
                <div className="col-span-5 px-4 py-2">
                    <Row justifyContent="space-between">
                        <Typography level="body1">Usage in the current billing cycle</Typography>
                        <NavigatingButton
                            variant="outlined"
                            href={KnownPages.AppSettingsAccountBilling}
                            size="sm">
                            See Current Plan
                        </NavigatingButton>
                    </Row>
                </div>
                <Divider className="col-span-5" />
                <InsightsItem
                    name="Messages"
                    value={usage.data?.usage.messages.used}
                    maxValue={usage.data?.usage.messages.total}
                    unlimited={false} />
                <Divider orientation="vertical" />
                <InsightsItem
                    name="Users"
                    value={usage.data?.usage.users.used}
                    maxValue={usage.data?.usage.users.total}
                    unlimited={false} />
                <Divider orientation="vertical" />
                <InsightsItem
                    name="Workers"
                    value={usage.data?.usage.workers.used}
                    maxValue={usage.data?.usage.workers.total}
                    unlimited={false} />
            </div>
        </UsageCard>
    );
}
