import NextLink from 'next/link';
import { Link as JoyLink, LinkProps } from '@mui/joy';

export default function Link(props: LinkProps & { href: string }) {
    const { href, ...rest } = props;
    return (
        <NextLink href={href} passHref legacyBehavior>
            <JoyLink {...rest} />
        </NextLink>
    );
}
