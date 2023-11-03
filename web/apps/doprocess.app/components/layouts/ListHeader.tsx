import { type ReactNode } from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';

type ListHeaderProps = {
    header: ReactNode | string | undefined;
    actions?: (ReactNode | boolean | null)[];
    description?: string | ReactNode;
};

export function ListHeader({ header, actions, description }: ListHeaderProps) {
    return (
        <Stack spacing={1}>
            <Row spacing={2} justifyContent="space-between">
                {typeof header === 'string'
                    ? <Typography level="h5" noWrap title={header}>{header}</Typography>
                    : header}
                {actions?.map((action, i) => action && <div key={i}>{action}</div>)}
            </Row>
            {description && (typeof description === 'string' ? <Typography>{description}</Typography> : description)}
        </Stack>
    );
}
