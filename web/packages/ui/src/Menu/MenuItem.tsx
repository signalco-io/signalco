import { type PropsWithChildren, type ComponentPropsWithoutRef, Fragment } from 'react'
import { cx } from 'classix';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Row } from '../Row';
import { Link } from '../Link';

export type MenuItemProps = ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    startDecorator?: React.ReactNode;
    endDecorator?: React.ReactNode;
    href?: string;
};

export function MenuItem({ className, children, startDecorator, endDecorator, href, ...rest }: MenuItemProps) {
    const LinkOrNot = href
        ? (props: PropsWithChildren) => <Link href={href} {...props} />
        : (props: PropsWithChildren) => <Fragment {...props} />;

    return (
        <MenubarPrimitive.Item
            className={cx(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                className
            )}
            {...rest}
        >
            <LinkOrNot>
                <Row spacing={1}>
                    {startDecorator ?? null}
                    {children}
                    {endDecorator ?? null}
                </Row>
            </LinkOrNot>
        </MenubarPrimitive.Item>
    );
}
