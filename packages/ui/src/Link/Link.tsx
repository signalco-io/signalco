import NextLink from 'next/link';
import { ChildrenProps } from '../sharedTypes';

/** @alpha */
export interface LinkProps extends ChildrenProps {
    href: string;
}

/** @alpha */
export default function Link({ children, href }: LinkProps) {
    return (
        <NextLink
            href={href}
            passHref
            prefetch={false}
            style={{ textDecoration: 'none', color: 'var(--joy-palette-text-secondary)' }}>
            {children}
        </NextLink>
    );
}
