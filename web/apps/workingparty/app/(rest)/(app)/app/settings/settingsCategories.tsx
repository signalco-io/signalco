export type SettingsCategory = {
    id: string;
    name: string;
    subcategories?: never;
};

export type SettingsCategorySection = {
    id: string;
    name: string;
    subcategories: SettingsCategory[];
};

export const settingsCategories = [
    { id: 'profile', name: 'Profile' },
    { id: 'security', name: 'Security' },
    // { id: 'notifications', name: 'Notifications' },
    {
        id: 'account',
        name: 'Account settings',
        subcategories: [
            { id: 'general', name: 'General settings' },
            { id: 'usage', name: 'Usage' },
            { id: 'billing', name: 'Billing' },
        ]
    },
] satisfies Array<SettingsCategory | SettingsCategorySection>;
