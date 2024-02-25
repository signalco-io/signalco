export type SettingsCategory = {
    id: string;
    name: string;
    subcategories?: never;
};

export type SettingsCategorySection = {
    id?: never;
    name: string;
    subcategories: SettingsCategory[];
};

export const settingsCategories = [
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
