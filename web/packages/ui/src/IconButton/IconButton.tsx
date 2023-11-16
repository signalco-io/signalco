import { forwardRef, type ComponentProps, PropsWithChildren, useMemo } from 'react';
import {cx} from 'classix';
import { Link , LoaderSpinner } from '@signalco/ui-icons';
import { Slot } from '@radix-ui/react-slot';
import { Button } from '../Button';

export type IconButtonProps = ComponentProps<typeof Button>;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    href, disabled, asChild, loading, variant, children, fullWidth, className, size, ...rest
}: IconButtonProps, ref) => {
    const Comp = useMemo(() => href && !disabled
        ? ({ children }: PropsWithChildren) => <Link href={href}>{children}</Link>
        : ({ children }: PropsWithChildren) => <>{children}</>, [href, disabled]);
    const ButtonComp = useMemo(() => asChild ? Slot : 'button', [asChild]);

    return (
        <Comp>
            <ButtonComp
                ref={ref}
                className={cx(
                    'uitw-inline-flex uitw-gap-1 uitw-items-center uitw-justify-center uitw-text-sm uitw-font-medium uitw-transition-colors focus-visible:uitw-outline-none focus-visible:uitw-ring-2 focus-visible:uitw-ring-ring focus-visible:uitw-ring-offset-2 disabled:uitw-opacity-50 disabled:uitw-pointer-events-none uitw-ring-offset-background',
                    (!variant || variant === 'soft') && 'uitw-bg-secondary uitw-text-secondary-foreground hover:uitw-bg-secondary/80',
                    variant === 'outlined' && 'uitw-border uitw-border-input hover:uitw-bg-accent hover:uitw-text-accent-foreground',
                    variant === 'plain' && 'hover:uitw-bg-accent hover:uitw-text-accent-foreground',
                    variant === 'solid' && 'uitw-bg-primary uitw-text-primary-foreground hover:uitw-bg-primary/90',
                    (!size || size === 'md') && 'uitw-h-9 uitw-w-9 uitw-p-2 uitw-rounded-md',
                    size === 'sm' && 'uitw-h-8 uitw-w-8 uitw-rounded-sm uitw-p-2',
                    size === 'lg' && 'uitw-h-12 uitw-w-12 uitw-rounded-md',
                    fullWidth && 'uitw-w-full',
                    className
                )}
                {...rest}>
                {loading && <LoaderSpinner className="uitw-mr-2 uitw-h-4 uitw-w-4 uitw-animate-spin" />}
                {loading ? null : children}
            </ButtonComp>
        </Comp>
    );
});
IconButton.displayName = 'IconButton';
export { IconButton };
