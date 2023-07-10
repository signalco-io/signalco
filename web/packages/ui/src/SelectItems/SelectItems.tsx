import { ComponentPropsWithoutRef, HTMLAttributes, ReactElement, useId } from 'react';
import { Check, Select as SelectIcon } from '@signalco/ui-icons';
import * as SelectPrimitive from "@radix-ui/react-select"
import { Stack } from '../Stack';
import { cx } from 'classix';

export type SelectItemsProps = HTMLAttributes<HTMLDivElement> & ComponentPropsWithoutRef<typeof SelectPrimitive.Root> & {
    label?: string,
    items: { value: string, label?: ReactElement | string, content?: ReactElement | string | undefined, disabled?: boolean }[],
    placeholder?: string,
    helperText?: string;
}

export function SelectItems(props: SelectItemsProps) {
    const {
        value,
        items,
        label,
        placeholder,
        helperText,
        ...rest
    } = props;

    const uid = useId();
    const id = `select-field-${label ?? placeholder}-${uid}`;

    return (
        <Stack spacing={1} {...rest}>
            {label && <label className="text-sm font-medium">{label}</label>}
            <SelectPrimitive.Root>
                <SelectPrimitive.Trigger
                    id={id}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <SelectPrimitive.Value placeholder={placeholder} />
                    <SelectPrimitive.Icon asChild>
                        <SelectIcon className="h-4 w-4 opacity-50" />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        className={cx(
                            "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                        )}
                        position={"popper"}
                    >
                        <SelectPrimitive.Viewport
                            className={cx(
                                "p-1",
                                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                            )}
                        >
                            {items.map(item => (
                                <SelectPrimitive.Item
                                    key={item.value}
                                    value={item.value}
                                    disabled={item.disabled}
                                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        <SelectPrimitive.ItemIndicator>
                                            <Check className="h-4 w-4" />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>
                                    <SelectPrimitive.ItemText>{item.content ?? (item.label ?? item.value)}</SelectPrimitive.ItemText>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
            {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
        </Stack>
    );
}
