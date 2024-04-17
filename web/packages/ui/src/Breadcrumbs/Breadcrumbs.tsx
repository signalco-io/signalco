import { type CSSProperties, Fragment, type ReactNode } from 'react';
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
        <div className="grid max-w-full grid-flow-col grid-cols-[--cols-template] gap-1"
            style={{
                '--cols-template': `minmax(0,auto) ${new Array(items.length - 1).fill('auto minmax(0,auto)').join(' ')}${endSeparator ? ' auto' : ''} 1fr`,
            } as CSSProperties}>
            {items.map((item, index) => (
                <Fragment key={item.href}>
                    <BreadcrumbsItem href={item.href} label={item.label} />
                    {index < items.length - 1 && <BreadcrumbsSeparator />}
                </Fragment>
            ))}
            {endSeparator && <BreadcrumbsSeparator />}
        </div>
    );
}
