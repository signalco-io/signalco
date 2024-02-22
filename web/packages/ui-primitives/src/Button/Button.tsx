import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren, type ReactNode, useMemo } from 'react'
import { LoaderSpinner } from '@signalco/ui-icons';
import { Slot } from '@radix-ui/react-slot';
import { VariantKeys } from '../theme';
import { Link } from '../Link';
import { cx } from '../cx'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: VariantKeys | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
    href?: string;
    asChild?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className,
    startDecorator,
    endDecorator,
    disabled,
    loading,
    variant,
    size,
    href,
    fullWidth,
    asChild,
    ...otherProps
}, ref) => {
    const Comp = useMemo(() => href && !disabled
        ? ({ children }: PropsWithChildren) => <Link href={href}>{children}</Link>
        : ({ children }: PropsWithChildren) => <>{children}</>, [href, disabled]);
    const ButtonComp = useMemo(() => asChild ? Slot : 'button', [asChild]);

    return (
        <Comp>
            <ButtonComp
                ref={ref}
                className={cx(
                    'inline-flex gap-1 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background cursor-default',
                    (!variant || variant === 'soft') && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    variant === 'outlined' && 'border border-input hover:bg-accent hover:text-accent-foreground',
                    variant === 'plain' && 'hover:bg-accent hover:text-accent-foreground',
                    variant === 'solid' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    variant === 'link' && 'underline-offset-4 hover:underline text-primary',
                    (!size || size === 'md') && 'h-10 py-2 px-4',
                    size === 'xs' && 'h-7 px-2 rounded-md gap-0.5',
                    size === 'sm' && 'h-9 px-3 rounded-md gap-0.5',
                    size === 'lg' && 'h-11 px-6 rounded-md gap-2',
                    fullWidth && 'w-full',
                    className
                )}
                disabled={loading || disabled}
                {...otherProps}
            >
                {!loading && (typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator)}
                {loading && <LoaderSpinner className="mr-2 size-4 min-h-4 min-w-4 animate-spin" />}
                {children}
                {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator}
            </ButtonComp>
        </Comp>
    )
});
Button.displayName = 'Button'
export { Button };
