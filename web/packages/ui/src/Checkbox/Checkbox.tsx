import { type ReactNode, useId, ComponentPropsWithoutRef } from 'react';
import { cx } from 'classix';
import { Check } from '@signalco/ui-icons';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label?: ReactNode;
    disableIcon?: boolean;
    readOnly?: boolean;
};

// TODO: Remove radix dependency

export function Checkbox({
    className,
    readOnly,
    label,
    disableIcon,
    defaultChecked,
    ...props
}: CheckboxProps) {
    const id = useId();
    const readonlyChecked = defaultChecked;
    return (
        <div className="uitw-flex uitw-items-center uitw-space-x-2">
            <CheckboxPrimitive.Root
                id={id}
                className={cx(
                    'uitw-peer uitw-h-4 uitw-w-4 uitw-shrink-0 uitw-rounded-sm uitw-border uitw-border-primary uitw-ring-offset-background focus-visible:uitw-outline-none focus-visible:uitw-ring-2 focus-visible:uitw-ring-ring focus-visible:uitw-ring-offset-2 disabled:uitw-cursor-not-allowed disabled:uitw-opacity-50 data-[state=checked]:uitw-bg-primary data-[state=checked]:uitw-text-primary-foreground',
                    readOnly && 'uitw-cursor-default',
                    className
                )}
                defaultChecked={readonlyChecked}
                checked={readOnly ? readonlyChecked : undefined}
                hidden={disableIcon}
                {...props}
            >
                <CheckboxPrimitive.Indicator
                    className={cx('uitw-flex uitw-items-center uitw-justify-center uitw-text-current')}
                >
                    <Check className="uitw-h-4 uitw-w-4" />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && (
                <label
                    htmlFor={id}
                    className="uitw-grow uitw-text-sm uitw-font-medium uitw-leading-none peer-disabled:uitw-cursor-not-allowed peer-disabled:uitw-opacity-70"
                >
                    {label}
                </label>
            )}
        </div>

    );
}
