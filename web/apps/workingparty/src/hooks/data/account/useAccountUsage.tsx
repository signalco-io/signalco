type AccountUsage = {
    loading: boolean,
    data?: {
        usage: {
            messages: {
                total: number,
                used: number,
            },
            users: {
                total: number,
                used: number,
            },
            workers: {
                total: number,
                used: number,
            },
            period: {
                start: Date,
                end: Date,
            },
        },
        plan: {
            name: string,
            price: number,
            currency: string,
            period: 'monthly' | 'yearly',
            start?: Date,
            end?: Date,
            hasUpgradePath: boolean
        },
    },
};

export function useAccountUsage(): AccountUsage {
    return {
        loading: false,
        data: {
            usage: {
                messages: {
                    total: 0,
                    used: 0,
                },
                users: {
                    total: 0,
                    used: 0,
                },
                workers: {
                    total: 10,
                    used: 5,
                },
                period: {
                    start: new Date(),
                    end: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                },
            },
            plan: {
                name: 'Plus',
                price: 9.99,
                currency: 'eur',
                period: 'monthly',
                start: new Date(),
                end: undefined,
                hasUpgradePath: true
            },
        },
    };
}

