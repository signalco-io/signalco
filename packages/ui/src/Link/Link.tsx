import { isAbsoluteUrl } from 'next/dist/shared/lib/utils';
import NextLink from 'next/link';
import { ChildrenProps } from '../sharedTypes';

/** @alpha */
export interface LinkProps extends ChildrenProps {
    href: string;
    className?: string | undefined;
}

/** @alpha */
export default function Link({ children, className, href }: LinkProps) {
    return (
        <NextLink
            href={href}
            className={className}
            target={isAbsoluteUrl(href) ? '_blank' : '_self'}
            passHref
            prefetch={false}
            style={{ textDecoration: 'none', color: 'var(--joy-palette-text-secondary)' }}>
            {children}
        </NextLink>
    );
}
