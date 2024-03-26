import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Chip } from '@signalco/ui-primitives/Chip';
import { Check } from '@signalco/ui-icons';
import { camelToSentenceCase } from '@signalco/js';

export function PaymentMethodInfo({ paymentMethod }: {
    paymentMethod: {
        displayBrand?: string | null;
        isDefault?: boolean;
        last4?: string;
        expMonth?: number;
        expYear?: number;
    };
}) {
    return (
        <Row spacing={2}>
            <div className="flex aspect-card w-20 flex-col items-center justify-center rounded-sm bg-muted px-4 py-2 uppercase">
                {paymentMethod.displayBrand ?? 'card'}
            </div>
            <Stack>
                <Row spacing={1}>
                    <strong>{camelToSentenceCase(paymentMethod.displayBrand ?? '')}</strong>
                    {paymentMethod.isDefault && <Chip color="info" size="sm"><Check className="size-3" /> Default</Chip>}
                </Row>
                <Row spacing={2}>
                    <Row spacing={1}>
                        <Typography level="body2">****</Typography>
                        <Typography level="body2">****</Typography>
                        <Typography level="body2">****</Typography>
                        <Typography level="body2">{paymentMethod.last4}</Typography>
                    </Row>
                    <Typography level="body2">Exp. {paymentMethod.expMonth}/{paymentMethod.expYear}</Typography>
                </Row>
            </Stack>
        </Row>
    );
}
