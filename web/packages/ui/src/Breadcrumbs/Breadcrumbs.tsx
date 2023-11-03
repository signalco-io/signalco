import { Fragment, type ReactNode } from 'react';
import { Typography } from '../Typography';
import { Row } from '../Row';
import { BreadcrumbsItem } from './BreadcrumbsItem';

export type BreadcrumbItem = {
    href?: string;
    label: ReactNode | string | undefined;
};

export type BreadcrumbsProps = {
    items?: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    if (!items?.length)
        return null;

    return (
        <Row spacing={1}>
            {items.map((item, index) => (
                <Fragment key={item.href}>
                    <BreadcrumbsItem href={item.href} label={item.label} />
                    {index < items.length - 1 && <Typography fontSize={'1.3em'}>{'\u203a'}</Typography>}
                </Fragment>
            ))}
        </Row>
    );
}
