import { PropsWithChildren } from 'react';
import { Link } from '@signalco/ui-primitives/Link';
import { Button } from '@signalco/ui-primitives/Button';

export type NavLinkItem = {
    href: string,
    text: string
};

export type PageNavMenuProps = PropsWithChildren<{
    links?: NavLinkItem[];
}>;

export function PageNavMenu({ links, children }: PageNavMenuProps) {
    return (
        <>
            {links?.map(nl => (
                <Link key={nl.href} href={nl.href}>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
            {children}
        </>
    );
}
