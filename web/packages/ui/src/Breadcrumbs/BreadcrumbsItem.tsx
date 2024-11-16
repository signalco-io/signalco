import { type ReactNode } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Link } from '@signalco/ui-primitives/Link';

type BreadcrumbsItemProps = {
    href?: string;
    label: ReactNode | undefined;
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
