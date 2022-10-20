import { Typography , Breadcrumbs as JoyBreadcrumbs } from '@mui/joy';
import Link from './Link';

export default function Breadcrumbs(props: { items: { href?: string, label: string | undefined }[] }) {
    const { items } = props;
    return (
        <JoyBreadcrumbs separator={'\u203a'} size="lg">
            {items.map(i => i.href
                ? <Link href={i.href}>{i.label}</Link>
                : <Typography>{i.label}</Typography>)}
        </JoyBreadcrumbs>
    );
}
