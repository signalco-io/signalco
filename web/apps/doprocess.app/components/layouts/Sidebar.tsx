'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {cx} from 'classix';
import { ListChecks, Play, Right, Text } from '@signalco/ui-icons';
import { List } from '@signalco/ui/dist/List';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { ListItem } from '../shared/ListItem';
import { KnownPages } from '../../src/knownPages';

export function Sidebar({ open, onOpenChange }: { open: boolean, onOpenChange?: (open: boolean) => void }) {
    const pathname = usePathname();

    const links = useMemo(() => [
        { href: KnownPages.Processes, label: 'Processes', Icon: ListChecks },
        { href: KnownPages.Runs, label: 'Runs', Icon: Play },
        { href: KnownPages.Documents, label: 'Documents', Icon: Text },
    ], []);

    // Colapse if not directly in a link but in child page
    useEffect(() => {
        const shouldBeOpen = links.some(({ href }) => pathname === href);
        onOpenChange?.(shouldBeOpen);
    }, [links, onOpenChange, pathname]);

    return (
        <div className="group flex flex-row gap-0.5 border-b py-1 pl-1 md:h-full md:flex-col md:border-none">
            <IconButton
                variant="plain"
                className={cx(
                    open ? 'opacity-0 rotate-180' : '',
                    'hidden md:block self-end text-muted-foreground transition-opacity group-hover:opacity-100'
                )}
                size="sm"
                onClick={() => onOpenChange?.(!open)}>
                <Right />
            </IconButton>
            <List className="flex-row md:flex-col">
                {links.map(({ href, label, Icon }) => (
                    <ListItem
                        key={href}
                        href={href}
                        label={open ? label : ''}
                        className="w-full"
                        startDecorator={<Icon size={16} />}
                        selected={pathname.startsWith(href)}
                    />
                ))}
            </List>
        </div>
    );
}
