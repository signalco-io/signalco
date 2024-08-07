import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren, type ReactNode, useMemo } from 'react'
import { LoaderSpinner } from '@signalco/ui-icons';
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
    ...otherProps
}, ref) => {
    const Comp = useMemo(() => href && !disabled
        ? ({ children }: PropsWithChildren) => <Link href={href}>{children}</Link>
        : ({ children }: PropsWithChildren) => <>{children}</>, [href, disabled]);

    return (
        <Comp>
            <button
                ref={ref}
                className={cx(
                    'select-none inline-flex gap-1 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background cursor-default',
                    (!variant || variant === 'soft') && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    variant === 'outlined' && 'border border-input hover:bg-accent hover:text-accent-foreground',
                    variant === 'plain' && 'hover:bg-accent hover:text-accent-foreground',
                    variant === 'solid' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    (!size || size === 'md') && 'h-10 py-2 px-4',
                    size === 'xs' && 'h-7 px-2 rounded-md gap-0.5',
                    size === 'sm' && 'h-9 px-3 rounded-md gap-1',
                    size === 'lg' && 'h-11 px-6 rounded-md gap-2',
                    // Note after sizes to override default padding
                    variant === 'link' && 'underline-offset-4 hover:underline text-primary p-0 cursor-pointer',
                    fullWidth && 'w-full',
                    className
                )}
                disabled={loading || disabled}
                {...otherProps}
            >
                {!loading && (typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator)}
                {loading && <LoaderSpinner className="mr-2 size-4 min-h-4 min-w-4 animate-spin" />}
                {typeof children === 'string' ? (
                    <span className="leading-normal">
                        {children}
                    </span>) : children}
                {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator}
            </button>
        </Comp>
    )
});
Button.displayName = 'Button'
export { Button };
