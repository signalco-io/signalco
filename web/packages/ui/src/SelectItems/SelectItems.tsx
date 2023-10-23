import { ComponentPropsWithoutRef, HTMLAttributes, ReactNode, useId } from 'react';
import { cx } from 'classix';
import { Check, Select as SelectIcon } from '@signalco/ui-icons';
import * as SelectPrimitive from '@radix-ui/react-select'
import { Stack } from '../Stack';
import { Row } from '../Row';

export type SelectItemsProps = HTMLAttributes<HTMLDivElement> & ComponentPropsWithoutRef<typeof SelectPrimitive.Root> & {
    label?: string,
    items: {
        value: string,
        icon?: ReactNode,
        label?: ReactNode | string,
        title?: string,
        content?: ReactNode | string | undefined,
        disabled?: boolean
    }[],
    placeholder?: string,
    helperText?: string;
    variant?: 'outlined' | 'plain';
    onValueChange?: (value: string) => void;
}

export function SelectItems(props: SelectItemsProps) {
    const {
        value,
        items,
        label,
        placeholder,
        helperText,
        onValueChange,
        variant,
        ...rest
    } = props;

    const uid = useId();
    const id = `select-field-${label ?? placeholder}-${uid}`;

    return (
        <Stack {...rest}>
            {label && <label className="uitw-text-sm uitw-font-medium">{label}</label>}
            <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
                <SelectPrimitive.Trigger
                    id={id}
                    className={cx(
                        'uitw-flex uitw-h-10 uitw-w-full uitw-items-center uitw-justify-between uitw-rounded-md uitw-bg-transparent uitw-px-3 uitw-py-2 uitw-text-sm uitw-ring-offset-background placeholder:uitw-text-muted-foreground focus:uitw-outline-none focus:uitw-ring-2 focus:uitw-ring-ring focus:uitw-ring-offset-2 disabled:uitw-cursor-not-allowed disabled:uitw-opacity-50',
                        (!variant || variant === 'outlined') && 'uitw-border uitw-border-input'
                    )}
                    aria-label={label ?? placeholder}
                >
                    <SelectPrimitive.Value placeholder={label ?? placeholder} />
                    <SelectPrimitive.Icon asChild>
                        <SelectIcon className="uitw-h-4 uitw-w-4 uitw-opacity-50" />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        className={cx(
                            'uitw-relative uitw-z-50 uitw-min-w-[8rem] uitw-overflow-hidden uitw-rounded-md uitw-border uitw-bg-popover uitw-text-popover-foreground uitw-shadow-md data-[state=open]:uitw-animate-in data-[state=closed]:uitw-animate-out data-[state=closed]:uitw-fade-out-0 data-[state=open]:uitw-fade-in-0 data-[state=closed]:uitw-zoom-out-95 data-[state=open]:uitw-zoom-in-95 data-[side=bottom]:uitw-slide-in-from-top-2 data-[side=left]:uitw-slide-in-from-right-2 data-[side=right]:uitw-slide-in-from-left-2 data-[side=top]:uitw-slide-in-from-bottom-2',
                            'data-[side=bottom]:uitw-translate-y-1 data-[side=left]:-uitw-translate-x-1 data-[side=right]:uitw-translate-x-1 data-[side=top]:-uitw-translate-y-1'
                        )}
                        position={'popper'}
                    >
                        <SelectPrimitive.Viewport
                            className={cx(
                                'uitw-p-1',
                                'uitw-h-[var(--radix-select-trigger-height)] uitw-w-full uitw-min-w-[var(--radix-select-trigger-width)]'
                            )}
                        >
                            {items.map(item => (
                                <SelectPrimitive.Item
                                    key={item.value}
                                    value={item.value}
                                    disabled={item.disabled}
                                    className="uitw-relative uitw-flex uitw-w-full uitw-cursor-default uitw-select-none uitw-items-center uitw-rounded-sm uitw-py-1.5 uitw-pl-8 uitw-pr-2 uitw-text-sm uitw-outline-none focus:uitw-bg-accent focus:uitw-text-accent-foreground data-[disabled]:uitw-pointer-events-none data-[disabled]:uitw-opacity-50"
                                    title={item.title}
                                >
                                    <span className="uitw-absolute uitw-left-2 uitw-flex uitw-h-3.5 uitw-w-3.5 uitw-items-center uitw-justify-center">
                                        <SelectPrimitive.ItemIndicator>
                                            <Check className="uitw-h-4 uitw-w-4" />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>
                                    <SelectPrimitive.ItemText>
                                        <Row spacing={1}>
                                            {item.icon}
                                            {item.content ?? (item.label ?? item.value)}
                                        </Row>
                                    </SelectPrimitive.ItemText>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
            {helperText && <p className="uitw-text-sm uitw-text-muted-foreground">{helperText}</p>}
        </Stack>
    );
}
