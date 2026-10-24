import { ComponentProps, forwardRef } from 'react';
import NextLink from 'next/link';
import { isAbsoluteUrl } from '@signalco/js';
import { cx } from '../cx';

export type LinkProps = ComponentProps<typeof NextLink>;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ className, href, children, ...rest }: LinkProps, ref) => {
    return (
        <NextLink
            ref={ref}
            href={href}
            className={cx(
                typeof children === 'string' && 'no-underline text-muted-foreground',
                className
            )}
            target={isAbsoluteUrl(href) ? '_blank' : '_self'}
            {...rest}>
            {children}
        </NextLink>
    );
});
Link.displayName = 'Link';
export { Link };