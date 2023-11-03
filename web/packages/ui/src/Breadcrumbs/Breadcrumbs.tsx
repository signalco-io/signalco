import { Fragment, type ReactNode } from 'react';
import { Row } from '../Row';
import { BreadcrumbsSeparator } from './BreadcrumbsSeparator';
import { BreadcrumbsItem } from './BreadcrumbsItem';

export type BreadcrumbItem = {
    href?: string;
    label: ReactNode | string | undefined;
};

export type BreadcrumbsProps = {
    items?: BreadcrumbItem[];
    endSeparator?: boolean;
};

export function Breadcrumbs({ items, endSeparator }: BreadcrumbsProps) {
    if (!items?.length)
        return null;

    return (
        <Row spacing={1}>
            {items.map((item, index) => (
                <Fragment key={item.href}>
                    <BreadcrumbsItem href={item.href} label={item.label} />
                    {index < items.length - 1 && <BreadcrumbsSeparator />}
                </Fragment>
            ))}
            {endSeparator && <BreadcrumbsSeparator />}
        </Row>
    );
}
