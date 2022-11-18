import { Fragment } from 'react';
import Link from './Link';
import { Typography, Breadcrumbs as JoyBreadcrumbs } from '@mui/joy';

export function Breadcrumbs(props: { items: { href?: string, label: string | undefined }[] }) {
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
