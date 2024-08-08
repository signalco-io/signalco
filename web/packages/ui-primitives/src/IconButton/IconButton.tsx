import { forwardRef, type ComponentProps, PropsWithChildren, useMemo } from 'react';
import { LoaderSpinner } from '@signalco/ui-icons';
import { Link } from '../Link';
import { cx } from '../cx';
import { Button } from '../Button';

export type IconButtonProps = ComponentProps<typeof Button>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    href, disabled, loading, variant, children, fullWidth, className, size, ...rest
}: IconButtonProps, ref) => {
    const Comp = useMemo(() => href && !disabled
        ? ({ children }: PropsWithChildren) => <Link href={href}>{children}</Link>
        : ({ children }: PropsWithChildren) => <>{children}</>, [href, disabled]);

    return (
        <Comp>
            <button
                ref={ref}
                className={cx(
                    'inline-flex gap-1 items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                    (!variant || variant === 'soft') && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    variant === 'outlined' && 'border border-input hover:bg-accent hover:text-accent-foreground',
                    variant === 'plain' && 'hover:bg-accent hover:text-accent-foreground',
                    variant === 'solid' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    (!size || size === 'md') && 'h-9 w-9 p-2 rounded-md',
                    size === 'xs' && 'h-6 w-6 rounded-sm p-1',
                    size === 'sm' && 'h-8 w-8 rounded-sm p-2',
                    size === 'lg' && 'h-12 w-12 rounded-md',
                    fullWidth && 'w-full',
                    className
                )}
                {...rest}>
                {loading && <LoaderSpinner className="mr-2 size-4 animate-spin" />}
                {loading ? null : children}
            </button>
        </Comp>
    );
});
IconButton.displayName = 'IconButton';
export { IconButton };
