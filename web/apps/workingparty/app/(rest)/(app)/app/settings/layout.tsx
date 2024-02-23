'use client';

import { Fragment, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List, ListHeader } from '@signalco/ui-primitives/List';
import { AI, Store } from '@signalco/ui-icons';
import { SplitView } from '@signalco/ui/SplitView';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { KnownPages } from '../../../../../src/knownPages';
import { AppSidebar } from '../../../../../src/components/AppSidebar';


type SettingsCategory = {
    id: string;
    name: string;
    subcategories?: never;
};

type SettingsCategorySection = {
    id?: never;
    name: string;
    subcategories: SettingsCategory[];
};

export const marketplaceCategories = [
    { id: 'profile', name: 'Profile' },
    { id: 'security', name: 'Security' },
    { id: 'notifications', name: 'Notifications' },
    {
        name: 'Account settings',
        subcategories: [
            { id: 'account', name: 'General settings' },
            { id: 'usage', name: 'Usage' },
            { id: 'account-billing', name: 'Billing' },
        ]
    },
] satisfies Array<SettingsCategory | SettingsCategorySection>;


export default function AppSettingsLayout({ children }: PropsWithChildren) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useSearchParam('category', marketplaceCategories[0]?.id);

    return (
        <SplitView>
            <AppSidebar>
                <List className="p-2" spacing={1}>
                    <ListItem
                        nodeId="marketplace"
                        onSelected={() => router.push(KnownPages.AppMarketplace)}
                        label="Workers Marketplace"
                        startDecorator={<Store className="w-5" />}
                        className="justify-start gap-2 px-2" />
                    <ListItem
                        nodeId="marketplace"
                        onSelected={() => router.push(KnownPages.AppWorkers)}
                        label="Workers"
                        startDecorator={<AI className="w-5" />}
                        className="justify-start gap-2 px-2" />
                </List>
                <ListHeader header="Settings" className="px-2" />
                <List className="overflow-y-auto p-2">
                    {marketplaceCategories.map(category => (
                        <Fragment key={category.id ?? category.name}>
                            {category.id ? (
                                <ListItem
                                    key={category.name}
                                    label={category.name}
                                    nodeId={category.id}
                                    selected={category.id === selectedCategory}
                                    onSelected={(nodeId: string) => setSelectedCategory(nodeId)}
                                />
                            ) : (
                                <Typography level="body3" uppercase bold className="py-4">{category.name}</Typography>
                            )}
                            {category.subcategories && (
                                <List>
                                    {category.subcategories.map(subcategory => (
                                        <ListItem
                                            key={subcategory.name}
                                            label={subcategory.name}
                                            nodeId={subcategory.id}
                                            selected={subcategory.id === selectedCategory}
                                            onSelected={(nodeId: string) => setSelectedCategory(nodeId)}
                                        />
                                    ))}
                                </List>
                            )}
                        </Fragment>
                    ))}
                </List>
            </AppSidebar>
            <div className="h-full">
                {children}
            </div >
        </SplitView >
    );
}
