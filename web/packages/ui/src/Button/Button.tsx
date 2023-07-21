import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { cx } from 'classix'
import { LoaderSpinner } from '@signalco/ui-icons';
import { VariantKeys } from '../theme';
import { Link } from '../Link';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: string;
    variant?: VariantKeys | 'link';
    size?: 'sm' | 'md' | 'lg';
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean; // TODO: Implement
    href?: string;
};

export function Button({
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
}: ButtonProps) {
    const Comp = href && !disabled
        ? ({ children }: PropsWithChildren) => <Link href={href}>{children}</Link>
        : ({ children }: PropsWithChildren) => <>{children}</>;
    return (
        <Comp>
            <button
                className={cx(
                    'inline-flex gap-1 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                    (!variant || variant === 'soft') && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    variant === 'outlined' && 'border border-input hover:bg-accent hover:text-accent-foreground',
                    variant === 'plain' && 'hover:bg-accent hover:text-accent-foreground',
                    variant === 'solid' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    variant === 'link' && 'underline-offset-4 hover:underline text-primary',
                    (!size || size === 'md') && 'h-10 py-2 px-4',
                    size === 'sm' && 'h-9 px-3 rounded-md gap-0.5',
                    size === 'lg' && 'h-11 px-8 rounded-md gap-2',
                    fullWidth && 'w-full',
                    className
                )}
                disabled={loading || disabled}
                {...otherProps}
            >
                {!loading && startDecorator}
                {loading && <LoaderSpinner className="mr-2 h-4 w-4 animate-spin" />}
                {children}
                {endDecorator}
            </button>
        </Comp>
    )
}
