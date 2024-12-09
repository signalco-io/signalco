import React, { Fragment, PropsWithChildren, forwardRef } from 'react'
import { Navigate } from '@signalco/ui-icons'
import {
    Root, Trigger, Group, Portal, Sub,
    RadioGroup, SubTrigger, SubContent,
    Content, Item,
    Label, Separator
} from '@radix-ui/react-dropdown-menu'
import { Row } from '../Row'
import { cx } from '../cx'

const DropdownMenu = Root

const DropdownMenuTrigger = Trigger

const DropdownMenuGroup = Group

const DropdownMenuPortal = Portal

const DropdownMenuSub = Sub

const DropdownMenuRadioGroup = RadioGroup

const DropdownMenuSubTrigger = forwardRef<
    React.ElementRef<typeof SubTrigger>,
    React.ComponentPropsWithoutRef<typeof SubTrigger> & {
        inset?: boolean
    }
>(({ className, inset, children, ...props }, ref) => (
    <SubTrigger
        ref={ref}
        className={cx(
            'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
            inset && 'pl-8',
            className
        )}
        {...props}
    >
        {children}
        <Navigate className="ml-auto size-4" />
    </SubTrigger>
))
DropdownMenuSubTrigger.displayName = SubTrigger.displayName;

const DropdownMenuSubContent = forwardRef<
    React.ElementRef<typeof SubContent>,
    React.ComponentPropsWithoutRef<typeof SubContent>
>(({ className, ...props }, ref) => (
    <SubContent
        ref={ref}
        className={cx(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName = SubContent.displayName;

const DropdownMenuContent = forwardRef<
    React.ElementRef<typeof Content>,
    React.ComponentPropsWithoutRef<typeof Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <Portal>
        <Content
            ref={ref}
            sideOffset={sideOffset}
            className={cx(
                'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
                'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    </Portal>
))
DropdownMenuContent.displayName = Content.displayName

const DropdownMenuItem = forwardRef<
    React.ElementRef<typeof Item>,
    React.ComponentPropsWithoutRef<typeof Item> & {
        inset?: boolean,
        href?: string,
        startDecorator?: React.ReactNode,
        endDecorator?: React.ReactNode
    }
>(({ className, inset, href, children, startDecorator, endDecorator, ...props }, ref) => {
    const LinkOrNot = href
        ? (props: PropsWithChildren) => <a href={href} {...props} />
        : (props: PropsWithChildren) => <Fragment {...props} />;
    const DecoratorWrapper = startDecorator || endDecorator ? Row : Fragment;
    const decoratorProps: { className?: string, spacing?: number } = {};
    if (startDecorator || endDecorator) {
        decoratorProps.className = 'w-full';
        decoratorProps.spacing = 1;
    }

    return (
        <LinkOrNot>
            <Item
                ref={ref}
                className={cx(
                    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    inset && 'pl-8',
                    className
                )}
                {...props}>
                <DecoratorWrapper {...decoratorProps}>
                    {startDecorator}
                    {children}
                    {endDecorator}
                </DecoratorWrapper>
            </Item>
        </LinkOrNot>
    )
})
DropdownMenuItem.displayName = Item.displayName

const DropdownMenuLabel = forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <Label
        ref={ref}
        className={cx(
            'px-2 py-1.5 text-sm font-semibold',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
))
DropdownMenuLabel.displayName = Label.displayName

const DropdownMenuSeparator = forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
    <Separator
        ref={ref}
        className={cx('-mx-1 my-1 h-px bg-muted', className)}
        {...props}
    />
))
DropdownMenuSeparator.displayName = Separator.displayName

function DropdownMenuShortcut({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cx('ml-auto text-xs tracking-widest opacity-60', className)}
            {...props}
        />
    )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
}
