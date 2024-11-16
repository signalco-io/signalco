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
            { id: 'design', name: 'Design' },
            { id: 'finance', name: 'Finance' },
            { id: 'salesAndMarketing', name: 'Sales and Marketing' },
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
            { id: 'entertainment', name: 'Entertainment' },
            { id: 'lifestyle', name: 'Lifestyle' },
            { id: 'travel', name: 'Travel' },
        ]
    },
] satisfies Array<MarketplaceCategory | MarketplaceCategorySection>;
