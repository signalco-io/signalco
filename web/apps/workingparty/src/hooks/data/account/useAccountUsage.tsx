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

export function useAccountBilling() {
    return {
        loading: false,
        data: {
            paymentMethods: [
                {
                    id: '1',
                    type: 'card',
                    last4: '4242',
                    expMonth: 12,
                    expYear: 2023,
                    brand: 'visa',
                    default: true,
                },
                {
                    id: '2',
                    type: 'card',
                    last4: '1234',
                    expMonth: 6,
                    expYear: 2022,
                    brand: 'mastercard',
                    default: false,
                },
            ],
            billingInfo: {
                name: 'John Doe',
                address: '1234 Main St, Springfield, IL 62701, United States',
            },
        },
    };
}