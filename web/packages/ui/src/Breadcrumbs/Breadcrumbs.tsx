import { Fragment } from 'react';
import { Typography } from '../Typography';
import { Row } from '../Row';
import { BreadcrumbsItem } from './BreadcrumbsItem';

export type BreadcrumbItem = {
    href?: string;
    label: string | undefined;
};

export type BreadcrumbsProps = {
    items?: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <Row spacing={1}>
            {items?.map((item, index) => (
                <Fragment key={item.label}>
                    <BreadcrumbsItem href={item.href} label={item.label} />
                    {index < items.length - 1 && <Typography fontSize={'1.3em'}>{'\u203a'}</Typography>}
                </Fragment>
            ))}
        </Row>
    );
}
