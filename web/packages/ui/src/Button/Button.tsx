import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren, type ReactNode, useMemo } from 'react'
import { cx } from 'classix'
import { LoaderSpinner } from '@signalco/ui-icons';
import { Slot } from '@radix-ui/react-slot';
import { VariantKeys } from '../theme';
import { Link } from '../Link';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: VariantKeys | 'link';
    size?: 'sm' | 'md' | 'lg';
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
                    'uitw-inline-flex uitw-gap-1 uitw-items-center uitw-justify-center uitw-rounded-md uitw-text-sm uitw-font-medium uitw-transition-colors focus-visible:uitw-outline-none focus-visible:uitw-ring-2 focus-visible:uitw-ring-ring focus-visible:uitw-ring-offset-2 disabled:uitw-opacity-50 disabled:uitw-pointer-events-none uitw-ring-offset-background',
                    (!variant || variant === 'soft') && 'uitw-bg-secondary uitw-text-secondary-foreground hover:uitw-bg-secondary/80',
                    variant === 'outlined' && 'uitw-border uitw-border-input hover:uitw-bg-accent hover:uitw-text-accent-foreground',
                    variant === 'plain' && 'hover:uitw-bg-accent hover:uitw-text-accent-foreground',
                    variant === 'solid' && 'uitw-bg-primary uitw-text-primary-foreground hover:uitw-bg-primary/90',
                    variant === 'link' && 'uitw-underline-offset-4 hover:uitw-underline uitw-text-primary',
                    (!size || size === 'md') && 'uitw-h-10 uitw-py-2 uitw-px-4',
                    size === 'sm' && 'uitw-h-9 uitw-px-3 uitw-rounded-md uitw-gap-0.5',
                    size === 'lg' && 'uitw-h-11 uitw-px-6 uitw-rounded-md uitw-gap-2',
                    fullWidth && 'uitw-w-full',
                    className
                )}
                disabled={loading || disabled}
                {...otherProps}
            >
                {!loading && (typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator)}
                {loading && <LoaderSpinner className="uitw-mr-2 uitw-h-4 uitw-w-4 uitw-animate-spin" />}
                {children}
                {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator}
            </ButtonComp>
        </Comp>
    )
});
Button.displayName = 'Button'
export { Button };
