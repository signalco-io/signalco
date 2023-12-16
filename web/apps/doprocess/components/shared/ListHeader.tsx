import { Fragment, type ReactNode } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';

type ListHeaderProps = {
    header: ReactNode | string | undefined;
    icon?: ReactNode;
    actions?: (ReactNode | boolean | null)[];
    description?: string | ReactNode;
};

export function ListHeader({ header, icon, actions, description }: ListHeaderProps) {
    return (
        <Stack spacing={1}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-1">
                <Row spacing={1} className="shrink-0">
                    <div>
                        {icon}
                    </div>
                    {typeof header === 'string'
                        ? <Typography level="h5" noWrap title={header}>{header}</Typography>
                        : header}
                </Row>
                <Row spacing={0.5}>
                    {actions?.map((action, i) => action && <Fragment key={i}>{action}</Fragment>)}
                </Row>
            </div>
            {description && (typeof description === 'string' ? <Typography>{description}</Typography> : description)}
        </Stack>
    );
}
