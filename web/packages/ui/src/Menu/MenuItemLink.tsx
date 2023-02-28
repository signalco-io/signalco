import Link from "next/link";
import MenuItem, { MenuItemProps } from "./MenuItem";

/** @alpha */
export interface MenuItemLinkProps extends MenuItemProps {
    href: string;
}

/** @alpha */
export default function MenuItemLink({ href, ...rest }: MenuItemLinkProps) {
    return (
        <Link href={href} passHref>
            <MenuItem {...rest} />
        </Link>
    );
}
