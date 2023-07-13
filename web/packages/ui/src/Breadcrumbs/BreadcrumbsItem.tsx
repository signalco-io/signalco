import { Typography } from '../Typography';
import { Link } from '../Link';

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
