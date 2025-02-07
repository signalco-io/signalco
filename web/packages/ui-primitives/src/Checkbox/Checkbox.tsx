import { type ReactNode, useId, ComponentPropsWithoutRef } from 'react';
import { Check } from '@signalco/ui-icons';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cx } from '../cx';

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
        <div className="flex items-center space-x-2">
            <CheckboxPrimitive.Root
                id={id}
                className={cx(
                    'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                    readOnly && 'cursor-default',
                    className
                )}
                defaultChecked={readonlyChecked}
                checked={readOnly ? readonlyChecked : undefined}
                hidden={disableIcon}
                {...props}
            >
                <CheckboxPrimitive.Indicator
                    className={cx('flex items-center justify-center text-current')}
                >
                    <Check className="size-4" />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && (
                <label
                    htmlFor={id}
                    className="grow text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}
        </div>

    );
}
