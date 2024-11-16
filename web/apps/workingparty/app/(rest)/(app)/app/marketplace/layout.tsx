'use client';

import { Fragment, PropsWithChildren } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List, ListHeader } from '@signalco/ui-primitives/List';
import { AI, Store } from '@signalco/ui-icons';
import { SplitView } from '@signalco/ui/SplitView';
import { KnownPages } from '../../../../../src/knownPages';
import { marketplaceCategories } from '../../../../../src/data/marketplaceCategories';
import { AppSidebar } from '../../../../../src/components/AppSidebar';

export default function AppMarketplaceLayout({ children }: PropsWithChildren) {
    const router = useRouter();
    const pathname = usePathname();
    const selectedCategoryId = pathname.split('/')[3];

    return (
        <SplitView>
            <AppSidebar>
                <List className="p-2" spacing={1}>
                    <ListItem
                        nodeId="marketplace"
                        selected
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
                <ListHeader header="Marketplace Categories" className="px-2" />
                <List className="overflow-y-auto p-2 pt-0">
                    {marketplaceCategories.map(category => (
                        <Fragment key={category.id ?? category.name}>
                            {category.id ? (
                                <ListItem
                                    key={category.name}
                                    label={category.name}
                                    nodeId={category.id}
                                    selected={category.id === selectedCategoryId}
                                    onSelected={(nodeId: string) => router.push(KnownPages.AppMarketplaceCategory(nodeId))}
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
                                            selected={subcategory.id === selectedCategoryId}
                                            onSelected={(nodeId: string) => router.push(KnownPages.AppMarketplaceCategory(nodeId))}
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
