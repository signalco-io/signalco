import { ComponentPropsWithoutRef, forwardRef, HTMLAttributes, ReactNode, useId } from 'react';
import { Check, Select as SelectIcon, Up, Down } from '@signalco/ui-icons';
import * as SelectPrimitive from '@radix-ui/react-select'
import { Stack } from '../Stack';
import { cx } from '../cx';

export type SelectItemsProps<T extends string> = HTMLAttributes<HTMLDivElement> & Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'value' | 'defaultValue' | 'onValueChange'> & {
    value?: T;
    defaultValue?: T;
    onValueChange?(value: T): void;
    label?: string,
    items: {
        value: T,
        icon?: ReactNode,
        label?: ReactNode | string,
        title?: string,
        content?: ReactNode | string | undefined,
        disabled?: boolean
    }[],
    placeholder?: string,
    helperText?: string;
    variant?: 'outlined' | 'plain';
    container?: HTMLElement;
}

const SelectScrollUpButton = forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cx(
            'flex cursor-default items-center justify-center py-1',
            className
        )}
        {...props}
    >
        <Up className="size-4" />
    </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cx(
            'flex cursor-default items-center justify-center py-1',
            className
        )}
        {...props}
    >
        <Down className="size-4" />
    </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
    SelectPrimitive.ScrollDownButton.displayName

export function SelectItems<T extends string>(props: SelectItemsProps<T>) {
    const {
        id,
        name,
        value,
        defaultValue,
        items,
        label,
        placeholder,
        helperText,
        onValueChange,
        variant,
        container,
        ...rest
    } = props;

    const customId = useId();
    const labelId = label ? `label-${id ?? name ?? customId}` : undefined;

    return (
        <Stack spacing={0.5} {...rest}>
            {label && <label className="text-sm font-medium" id={labelId}>{label}</label>}
            <SelectPrimitive.Root
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                name={name}
                aria-labelledby={labelId}>
                <SelectPrimitive.Trigger
                    id={id}
                    className={cx(
                        'flex h-10 w-full items-center text-left justify-between rounded-md bg-transparent px-3 py-2 text-sm ring-offset-background',
                        '[&>span]:line-clamp-1',
                        'data-[placeholder]:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        (!variant || variant === 'outlined') && 'border border-input'
                    )}
                    aria-label={label ?? placeholder}
                >
                    <SelectPrimitive.Value placeholder={placeholder} />
                    <SelectPrimitive.Icon asChild>
                        <SelectIcon className="size-4 shrink-0 opacity-50" />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal container={container}>
                    <SelectPrimitive.Content
                        className={cx(
                            'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
                        )}
                        position={'popper'}
                    >
                        <SelectScrollUpButton />
                        <SelectPrimitive.Viewport
                            className={cx(
                                'p-1',
                                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
                            )}
                        >
                            {items.map(item => (
                                <SelectPrimitive.Item
                                    key={item.value}
                                    value={item.value}
                                    disabled={item.disabled}
                                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                    title={item.title}
                                >
                                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                                        <SelectPrimitive.ItemIndicator>
                                            <Check className="size-4" />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>
                                    <SelectPrimitive.ItemText className="flex items-center gap-2">
                                        {item.icon}
                                        {item.content ?? (item.label ?? item.value)}
                                    </SelectPrimitive.ItemText>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                        <SelectScrollDownButton />
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
            {helperText && <span className="text-sm text-red-600 dark:text-red-300">{helperText}</span>}
        </Stack>
    );
}
