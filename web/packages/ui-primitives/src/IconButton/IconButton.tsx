import { forwardRef, useMemo } from 'react';
import { LoaderSpinner } from '@signalco/ui-icons';
import { Link } from '../Link';
import { cx } from '../cx';
import { ButtonButtonProps } from '../Button';

// Enforce accessibility best practices (must have one of: aria-label, title, aria-labelledby)
export type IconButtonProps = ButtonButtonProps & (
    { 'aria-label': string } |
    { title: string } |
    { 'aria-labelledby': string }
);

const IconButton = forwardRef<HTMLElement, IconButtonProps>(({
    disabled, loading, variant, children, fullWidth, className, size, ...rest
}: IconButtonProps, ref) => {
    const Comp = useMemo(() => rest.href
        ? forwardRef((props: any, ref) => <Link ref={ref} {...props} />)
        : forwardRef((props: any, ref) => <button ref={ref} {...props} />), [rest.href]);

    return (
        <Comp
            ref={ref}
            className={cx(
                'inline-flex gap-1 items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                (!variant || variant === 'soft') && 'bg-primary/15 text-secondary-foreground hover:bg-primary/25',
                variant === 'outlined' && 'border border-input hover:bg-accent',
                variant === 'plain' && 'hover:bg-accent',
                variant === 'solid' && 'bg-primary text-primary-foreground hover:bg-primary/70',
                variant === 'link' && 'text-primary hover:text-primary/70',
                (!size || size === 'md') && 'h-9 w-9 p-2 rounded-md',
                size === 'xs' && 'h-6 w-6 rounded-sm p-1',
                size === 'sm' && 'h-8 w-8 rounded-sm p-2',
                size === 'lg' && 'h-12 w-12 rounded-md',
                fullWidth && 'w-full',
                className
            )}
            disabled={!rest.href && (loading || disabled)}
            {...rest}>
            {loading && <LoaderSpinner className="mr-2 size-4 animate-spin" />}
            {!loading && children}
        </Comp>
    );
});
IconButton.displayName = 'IconButton';
export { IconButton };
