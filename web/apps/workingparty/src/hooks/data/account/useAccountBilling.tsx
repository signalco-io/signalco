
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
