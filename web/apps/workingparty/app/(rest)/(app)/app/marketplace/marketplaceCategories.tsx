export type MarketplaceCategory = {
    id: string;
    name: string;
    subcategories?: never;
};

export type MarketplaceCategorySection = {
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
