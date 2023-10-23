import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useMemo } from 'react'
import { cx } from 'classix'
import { LoaderSpinner, Select } from '@signalco/ui-icons';
import { Slot } from '@radix-ui/react-slot';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    startDecorator?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
    asChild?: boolean;
};

const ButtonDropdown = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className,
    startDecorator,
    disabled,
    loading,
    fullWidth,
    asChild,
    ...otherProps
}, ref) => {
    const ButtonComp = useMemo(() => asChild ? Slot : 'button', [asChild]);

    return (
        <ButtonComp
            ref={ref}
            className={cx(
                'uitw-flex uitw-h-10 uitw-w-full uitw-min-w-[180px] uitw-items-center uitw-justify-between uitw-rounded-md uitw-bg-transparent uitw-px-3 uitw-py-2 uitw-text-sm uitw-ring-offset-background placeholder:uitw-text-muted-foreground focus:uitw-outline-none focus:uitw-ring-2 focus:uitw-ring-ring focus:uitw-ring-offset-2 disabled:uitw-cursor-not-allowed disabled:uitw-opacity-50',
                fullWidth && 'uitw-w-full',
                className
            )}
            disabled={loading || disabled}
            {...otherProps}
        >
            {!loading && startDecorator}
            {loading && <LoaderSpinner className="uitw-mr-2 uitw-h-4 uitw-w-4 uitw-animate-spin" />}
            <span>{children}</span>
            <Select className="uitw-h-4 uitw-w-4 uitw-opacity-50" />
        </ButtonComp>
    )
});
ButtonDropdown.displayName = 'ButtonDropdown'
export { ButtonDropdown };
