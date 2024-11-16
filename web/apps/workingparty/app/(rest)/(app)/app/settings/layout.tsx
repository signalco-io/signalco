'use client';

import { Fragment, PropsWithChildren } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List, ListHeader } from '@signalco/ui-primitives/List';
import { AI, Store } from '@signalco/ui-icons';
import { GeneralFormProvider } from '@signalco/ui-forms/GeneralFormProvider';
import { SplitView } from '@signalco/ui/SplitView';
import { KnownPages } from '../../../../../src/knownPages';
import { AppSidebar } from '../../../../../src/components/AppSidebar';
import { settingsCategories } from './settingsCategories';

export default function AppSettingsLayout({ children }: PropsWithChildren) {
    const router = useRouter();

    // Template: http://domain/app/settings/:category/:subcategory
    const pathName = usePathname();
    const pathParts = pathName.split('/').filter(Boolean);
    const selectedCategory = pathParts[3] ?? pathParts[2];

    const handleCategorySelected = (nodeId: string, parentNodeId?: string) => {
        router.push(KnownPages.AppSettings + `${parentNodeId ? `/${parentNodeId}` : ''}/${nodeId}`);
    }

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
                    {settingsCategories.map(category => (
                        <Fragment key={category.id ?? category.name}>
                            {!category.subcategories?.length ? (
                                <ListItem
                                    key={category.name}
                                    label={category.name}
                                    nodeId={category.id}
                                    selected={category.id === selectedCategory}
                                    onSelected={handleCategorySelected}
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
                                            onSelected={(nodeId: string) => handleCategorySelected(nodeId, category.id)}
                                        />
                                    ))}
                                </List>
                            )}
                        </Fragment>
                    ))}
                </List>
            </AppSidebar>
            <div className="h-screen overflow-y-auto overflow-x-hidden">
                <GeneralFormProvider>
                    {children}
                </GeneralFormProvider>
            </div >
        </SplitView >
    );
}
