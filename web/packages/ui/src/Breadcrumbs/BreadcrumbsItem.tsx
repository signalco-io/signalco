import { Link } from '../Link';
import { Typography } from '../Typography';

export function BreadcrumbsItem({ href, label }: { href?: string; label: string | undefined; }) {
    if (href) {
        return (
            <Link href={href}>{label}</Link>
        );
    } else {
        return (
            <Typography>{label}</Typography>
        );
    }
}
