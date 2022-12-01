import Link from "next/link";
import MenuItem, { MenuItemProps } from "./MenuItem";

export interface MenuItemLinkProps extends MenuItemProps {
    href: string;
}

export default function MenuItemLink({ href, ...rest }: MenuItemLinkProps) {
    return (
        <Link href={href} passHref>
            <MenuItem {...rest} />
        </Link>
    );
}
