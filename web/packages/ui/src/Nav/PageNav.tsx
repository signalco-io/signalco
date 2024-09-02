import { PropsWithChildren, ReactNode } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { Container } from '@signalco/ui-primitives/Container';
import { Button } from '@signalco/ui-primitives/Button';
import { Menu } from '@signalco/ui-icons';

type PageNavProps = PropsWithChildren<{
    logo: ReactNode;
    links?: NavLinkItem[];
}>;

export type NavLinkItem = {
    href: string,
    text: string
};

export function PageNav({ logo, links, children }: PageNavProps) {
    return (
        <div>
            <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" aria-label="Toggle menu" />
            <header className="fixed inset-x-0 top-0 z-10 flex h-16 items-center border-b backdrop-blur-md">
                <Container>
                    <Row justifyContent="space-between">
                        <div className="flex h-full flex-col items-center">
                            <Link href="/">
                                {logo}
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <nav className="hidden md:block">
                                <Row spacing={1}>
                                    {links?.map(nl => (
                                        <Button
                                            variant="plain"
                                            size="lg"
                                            href={nl.href}
                                            key={nl.href}>
                                            {nl.text}
                                        </Button>
                                    ))}
                                </Row>
                            </nav>
                            <label htmlFor="mobile-menu-toggle" className="block md:hidden">
                                <Menu />
                            </label>
                            {children && (
                                <div className="ml-2">
                                    {children}
                                </div>
                            )}
                        </Row>
                    </Row>
                </Container>
            </header>
            <nav className="hidden peer-checked:block md:hidden">
                <div className="fixed inset-x-2 top-16 z-10 mt-2 rounded-md border backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                    <Stack spacing={1}>
                        {links?.map(nl => (
                            <Button
                                variant="plain"
                                size="lg"
                                fullWidth
                                href={nl.href}
                                key={nl.href}>
                                {nl.text}
                            </Button>
                        ))}
                    </Stack>
                </div>
            </nav>
        </div>
    );
}
