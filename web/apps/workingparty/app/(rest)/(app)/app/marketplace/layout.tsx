'use client';

import { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List, ListHeader } from '@signalco/ui-primitives/List';
import { AI, Store } from '@signalco/ui-icons';
import { SplitView } from '@signalco/ui/SplitView';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { KnownPages } from '../../../../../src/knownPages';
import { AppSidebar } from '../../../../../src/components/AppSidebar';

type MarketplaceCategory = {
    id: string;
    name: string;
    subcategories?: never;
};

type MarketplaceCategorySection = {
    id?: never;
    name: string;
    subcategories: MarketplaceCategory[];
};

export const marketplaceCategories = [
    { id: 'explore', name: 'Explore' },
    {
        name: 'Business',
        subcategories: [
            { id: 'businessOps', name: 'Business Operations' },
            { id: 'salesAndMarketing', name: 'Sales and Marketing' },
            { id: 'finance', name: 'Finance' },
            { id: 'softwareDevelopment', name: 'Software Development' },
        ]
    },
    {
        name: 'Productivity',
        subcategories: [
            { id: 'education', name: 'Education' },
            { id: 'personalDevelopment', name: 'Personal Development' },
        ]
    },
    {
        name: 'Fun',
        subcategories: [
            { id: 'travel', name: 'Travel' },
            { id: 'lifestyle', name: 'Lifestyle' },
            { id: 'entertainment', name: 'Entertainment' },
        ]
    },
] satisfies Array<MarketplaceCategory | MarketplaceCategorySection>;

export const markeplaceCategoriesFlat = marketplaceCategories.flatMap(category => category.subcategories ?? [category]);

export default function AppMarketplaceLayout({ children }: PropsWithChildren) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useSearchParam('category', marketplaceCategories[0]?.id);

    return (
        <SplitView>
            <AppSidebar>
                <List>
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
                <ListHeader header="Marketplace Categories" />
                <List>
                    {marketplaceCategories.map(category => (
                        <>
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
                        </>
                    ))}
                </List>
            </AppSidebar>
            <div className="h-full">
                {children}
            </div >
        </SplitView >
    );
}
