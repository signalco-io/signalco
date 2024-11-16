import { Fragment, type ReactNode } from 'react';
import { Typography } from '../Typography';
import { Stack, StackProps } from '../Stack';
import { Skeleton } from '../Skeleton';
import { Row } from '../Row';
import { cx } from '../cx';

type ListHeaderProps = StackProps & {
    header: ReactNode | string | undefined;
    icon?: ReactNode;
    actions?: (ReactNode | boolean | null)[];
    description?: string | ReactNode;
    isLoading?: boolean;
};

export function ListHeader({ header, isLoading, icon, actions, description, className, spacing, ...rest }: ListHeaderProps) {
    return (
        <Stack spacing={spacing || 1} className={cx('w-full select-none', className)} {...rest}>
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-1">
                <Row spacing={1} className="shrink-0">
                    {icon && (
                        <div>
                            {icon}
                        </div>
                    )}
                    {isLoading && (
                        <Skeleton className="h-5 w-32" />
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
