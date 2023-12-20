import { Link } from '@signalco/ui-primitives/Link';
import { Button } from '@signalco/ui-primitives/Button';

type NavLinkItem = {
    href: string,
    text: string
};

export const navLinks: NavLinkItem[] = [
    // { href: '#explore', text: 'Explore' },
    // { href: KnownPages.Pricing, text: 'Pricing' }
];

export function NavMenu() {
    return (
        <>
            {navLinks.map(nl => (
                <Link key={nl.href} href={nl.href}>
                    <Button variant="plain" size="lg">{nl.text}</Button>
                </Link>
            ))}
        </>
    );
}
