import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';

type ListHeaderProps = {
    header: string | undefined;
    actions?: (React.ReactNode | boolean | null)[];
    description?: string | React.ReactNode;
};

export function ListHeader({ header, actions, description }: ListHeaderProps) {
    return (
        <Stack spacing={1}>
            <Row spacing={2} justifyContent="space-between">
                <Typography level="h5">{header}</Typography>
                {actions?.map((action, i) => action && <div key={i}>{action}</div>)}
            </Row>
            {description && (typeof description === 'string' ? <Typography>{description}</Typography> : description)}
        </Stack>
    );
}
