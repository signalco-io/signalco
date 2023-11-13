import { ReactNode } from 'react';
import { Typography } from '../Typography';
import { Link } from '../Link';

type BreadcrumbsItemProps = {
    href?: string;
    label: ReactNode | string | undefined;
};

export function BreadcrumbsItem({ href, label }: BreadcrumbsItemProps) {
    if (href) {
        return (
            <Link href={href}>{label}</Link>
        );
    } else {
        if (typeof label === 'string') {
            return (
                <Typography noWrap>{label}</Typography>
            );
        }
        return label;
    }
}
