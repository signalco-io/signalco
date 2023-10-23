import { Fragment, PropsWithChildren, forwardRef } from 'react'
import Link from 'next/link'
import { cx } from 'classix'
import { Navigate } from '@signalco/ui-icons'
import {
    Root, Trigger, Group, Portal, Sub,
    RadioGroup, SubTrigger, SubContent,
    Content, Item,
    Label, Separator
} from '@radix-ui/react-dropdown-menu'
import { Row } from '../Row'

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
            'uitw-flex uitw-cursor-default uitw-select-none uitw-items-center uitw-rounded-sm uitw-px-2 uitw-py-1.5 uitw-text-sm uitw-outline-none focus:uitw-bg-accent data-[state=open]:uitw-bg-accent',
            inset && 'uitw-pl-8',
            className
        )}
        {...props}
    >
        {children}
        <Navigate className="uitw-ml-auto uitw-h-4 uitw-w-4" />
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
            'uitw-z-50 uitw-min-w-[8rem] uitw-overflow-hidden uitw-rounded-md uitw-border uitw-bg-popover uitw-p-1 uitw-text-popover-foreground uitw-shadow-lg data-[state=open]:uitw-animate-in data-[state=closed]:uitw-animate-out data-[state=closed]:uitw-fade-out-0 data-[state=open]:uitw-fade-in-0 data-[state=closed]:uitw-zoom-out-95 data-[state=open]:uitw-zoom-in-95 data-[side=bottom]:uitw-slide-in-from-top-2 data-[side=left]:uitw-slide-in-from-right-2 data-[side=right]:uitw-slide-in-from-left-2 data-[side=top]:uitw-slide-in-from-bottom-2',
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
                'uitw-z-50 uitw-min-w-[8rem] uitw-overflow-hidden uitw-rounded-md uitw-border uitw-bg-popover uitw-p-1 uitw-text-popover-foreground uitw-shadow-md',
                'data-[state=open]:uitw-animate-in data-[state=closed]:uitw-animate-out data-[state=closed]:uitw-fade-out-0 data-[state=open]:uitw-fade-in-0 data-[state=closed]:uitw-zoom-out-95 data-[state=open]:uitw-zoom-in-95 data-[side=bottom]:uitw-slide-in-from-top-2 data-[side=left]:uitw-slide-in-from-right-2 data-[side=right]:uitw-slide-in-from-left-2 data-[side=top]:uitw-slide-in-from-bottom-2',
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
        ? (props: PropsWithChildren) => <Link href={href} {...props} />
        : (props: PropsWithChildren) => <Fragment {...props} />;
    const DecoratorWrapper = startDecorator || endDecorator ? Row : Fragment;

    return (
        <LinkOrNot>
            <Item
                ref={ref}
                className={cx(
                    'uitw-relative uitw-flex uitw-cursor-default uitw-select-none uitw-items-center uitw-rounded-sm uitw-px-2 uitw-py-1.5 uitw-text-sm uitw-outline-none uitw-transition-colors focus:uitw-bg-accent focus:uitw-text-accent-foreground data-[disabled]:uitw-pointer-events-none data-[disabled]:uitw-opacity-50',
                    inset && 'uitw-pl-8',
                    className
                )}
                {...props}>
                <DecoratorWrapper spacing={1} className="uitw-w-full">
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
            'uitw-px-2 uitw-py-1.5 uitw-text-sm uitw-font-semibold',
            inset && 'uitw-pl-8',
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
        className={cx('-uitw-mx-1 uitw-my-1 uitw-h-px uitw-bg-muted', className)}
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
            className={cx('uitw-ml-auto uitw-text-xs uitw-tracking-widest uitw-opacity-60', className)}
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
