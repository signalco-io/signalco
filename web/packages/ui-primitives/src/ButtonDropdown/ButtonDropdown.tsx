import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useMemo } from 'react'
import { LoaderSpinner, Select } from '@signalco/ui-icons';
import { cx } from '../cx'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    startDecorator?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
};

const ButtonDropdown = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className,
    startDecorator,
    disabled,
    loading,
    fullWidth,
    ...otherProps
}, ref) => {
    return (
        <button
            ref={ref}
            className={cx(
                'flex h-10 w-full min-w-[180px] items-center justify-between rounded-md bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                fullWidth && 'w-full',
                className
            )}
            disabled={loading || disabled}
            {...otherProps}
        >
            {!loading && startDecorator}
            {loading && <LoaderSpinner className="mr-2 size-4 animate-spin" />}
            <span>{children}</span>
            <Select className="size-4 opacity-50" />
        </button>
    )
});
ButtonDropdown.displayName = 'ButtonDropdown'
export { ButtonDropdown };
