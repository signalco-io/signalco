import { Fragment } from 'react';
import Link from '../Link';
import { Typography, Breadcrumbs as JoyBreadcrumbs } from '@mui/joy';

/** @alpha */
export type BreadcrumbsProps = {
    items: {
        href?: string;
        label: string | undefined;
    }[];
};

/** @alpha */
export default function Breadcrumbs(props: BreadcrumbsProps) {
    const { items } = props;
    return (
        <JoyBreadcrumbs separator={'\u203a'} size="lg">
            {items.map((i, index) =>
                <Fragment key={i.href ?? index}>
                    {i.href
                        ? <Link href={i.href}>{i.label}</Link>
                        : <Typography>{i.label}</Typography>}
                </Fragment>
            )}
        </JoyBreadcrumbs>
    );
}
