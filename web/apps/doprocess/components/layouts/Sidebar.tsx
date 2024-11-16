'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { cx } from '@signalco/ui-primitives/cx';
import { FileText, ListTodo, Play } from '@signalco/ui-icons';
import { UserButton } from '@signalco/auth-client/components';
import { KnownPages } from '../../src/knownPages';

export function Sidebar({ open, onOpenChange }: { open: boolean, onOpenChange?: (open: boolean) => void }) {
    const pathname = usePathname();

    const links = useMemo(() => [
        { href: KnownPages.Runs, label: 'Runs', Icon: Play },
        { href: KnownPages.Processes, label: 'Processes', Icon: ListTodo },
        { href: KnownPages.Documents, label: 'Documents', Icon: FileText },
    ], []);

    // Colapse if not directly in a link but in child page
    useEffect(() => {
        const shouldBeOpen = links.some(({ href }) => pathname === href);
        onOpenChange?.(shouldBeOpen);
    }, [links, onOpenChange, pathname]);

    return (
        <div className={cx(
            'group flex flex-row -mr-1 border-b md:h-full md:flex-col md:border-none',
            open && 'md:pl-2 md:gap-1'
        )}>
            <div className="flex flex-row items-center justify-between p-2">
                {open && <Typography semiBold tertiary level="body2" className="hidden md:block">Navigation</Typography>}
                <div className="px-0.5">
                    <UserButton />
                </div>
            </div>
            <List className={cx('flex-row md:flex-col', open && 'md:gap-2 md:pr-2')}>
                {links.map(({ href, label, Icon }) => (
                    <ListItem
                        key={href}
                        href={href}
                        label={label}
                        title={label}
                        className={cx('w-full', open ? 'rounded-none md:rounded-lg' : 'rounded-none md:py-3 md:[font-size:0] md:!gap-0')}
                        startDecorator={<Icon size={20} />}
                        selected={pathname.startsWith(href)}
                    />
                ))}
            </List>
        </div>
    );
}
