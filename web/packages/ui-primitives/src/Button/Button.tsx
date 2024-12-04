import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useMemo, AnchorHTMLAttributes } from 'react'
import { LoaderSpinner } from '@signalco/ui-icons';
import { VariantKeys } from '../theme';
import { Link } from '../Link';
import { cx } from '../cx'

export type ButtonButtonProps = {
    href?: never,
    variant?: VariantKeys | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonLinkProps = {
    href: string,
    variant?: VariantKeys | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export type ButtonProps = ButtonLinkProps | ButtonButtonProps;

const Button = forwardRef<HTMLElement, ButtonProps>(({
    children,
    className,
    startDecorator,
    endDecorator,
    disabled,
    loading,
    variant,
    size,
    fullWidth,
    ...otherProps
}, ref) => {
    const Comp = useMemo(() => otherProps.href
        ? forwardRef((props: any, ref) => <Link ref={ref} {...props} />)
        : forwardRef((props: any, ref) => <button ref={ref} {...props} />), [otherProps.href]);

    return (
        <Comp
            ref={ref as any}
            className={cx(
                'select-none inline-flex gap-1 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background cursor-default',
                (!variant || variant === 'soft') && 'bg-primary/15 text-primary hover:bg-primary/25 active:bg-primary/35',
                variant === 'outlined' && 'border border-input hover:bg-accent hover:text-accent-foreground active:bg-primary/10',
                variant === 'plain' && 'hover:bg-primary/10 hover:text-accent-foreground active:bg-primary/20',
                variant === 'solid' && 'bg-primary text-primary-foreground hover:bg-primary/70 active:bg-primary/80',
                (!size || size === 'md') && 'h-10 py-2 px-4',
                size === 'xs' && 'h-7 px-2 gap-0.5',
                size === 'sm' && 'h-9 px-3 gap-1',
                size === 'lg' && 'h-11 px-6 gap-2',
                // Note after sizes to override default padding
                variant === 'link' && 'underline-offset-4 hover:underline text-primary p-0 cursor-pointer',
                fullWidth && 'w-full',
                className
            )}
            disabled={!otherProps.href && (loading || disabled)}
            {...otherProps}>
            {!loading && (typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator)}
            {loading && <LoaderSpinner className="mr-2 size-4 min-h-4 min-w-4 animate-spin" />}
            {typeof children === 'string' ? (
                <span className="leading-normal">
                    {children}
                </span>) : children}
            {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator}
        </Comp>
    )
});
Button.displayName = 'Button'
export { Button };
