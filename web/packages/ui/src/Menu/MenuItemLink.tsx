import Link from "next/link";
import { MenuItem, MenuItemProps } from "./MenuItem";

export type MenuItemLinkProps = MenuItemProps & {
    href: string;
}

export function MenuItemLink({ href, ...rest }: MenuItemLinkProps) {
    return (
        <Link href={href} passHref>
            <MenuItem {...rest} />
        </Link>
    );
}
