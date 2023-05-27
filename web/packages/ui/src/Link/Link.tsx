import { cx } from 'classix';
import type { Url } from 'next/dist/shared/lib/router/router';
import { isAbsoluteUrl } from '@signalco/js';
import NextLink from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string | Url;
    className?: string | undefined;
    "aria-label"?: string | undefined;
};

export function Link({ className, href, ...rest }: LinkProps) {
    return (
        <NextLink
            href={href}
            className={cx('no-underline color-[var(--joy-palette-text-secondary)]', className)}
            target={isAbsoluteUrl(href) ? '_blank' : '_self'}
            passHref
            prefetch={false}
            {...rest}>
        </NextLink>
    );
}
