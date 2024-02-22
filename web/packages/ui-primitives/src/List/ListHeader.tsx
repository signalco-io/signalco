import { Fragment, type ReactNode } from 'react';
import { Typography } from '../Typography';
import { Stack } from '../Stack';
import { Row } from '../Row';

type ListHeaderProps = {
    header: ReactNode | string | undefined;
    icon?: ReactNode;
    actions?: (ReactNode | boolean | null)[];
    description?: string | ReactNode;
};

export function ListHeader({ header, icon, actions, description }: ListHeaderProps) {
    return (
        <Stack spacing={1} className="w-full">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-1">
                <Row spacing={1} className="shrink-0">
                    {icon && (
                        <div>
                            {icon}
                        </div>
                    )}
                    {typeof header === 'string'
                        ? <Typography level="body2" bold noWrap title={header} uppercase>{header}</Typography>
                        : header}
                </Row>
                <Row spacing={0.5}>
                    {actions?.map((action, i) => action && <Fragment key={i}>{action}</Fragment>)}
                </Row>
            </div>
            {description && (typeof description === 'string'
                ? <Typography level="body2">{description}</Typography>
                : description)}
        </Stack>
    );
}
