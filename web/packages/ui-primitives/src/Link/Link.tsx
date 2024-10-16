import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { isAbsoluteUrl } from '@signalco/js';
import { cx } from '../cx';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    className?: string | undefined;
    'aria-label'?: string | undefined;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ className, href, children, ...rest }: LinkProps, ref) => {
    return (
        <a
            ref={ref}
            href={href}
            className={cx(
                typeof children === 'string' && 'no-underline text-muted-foreground',
                className
            )}
            target={isAbsoluteUrl(href) ? '_blank' : '_self'}
            {...rest}>
            {children}
        </a>
    );
});
Link.displayName = 'Button'
export { Link };