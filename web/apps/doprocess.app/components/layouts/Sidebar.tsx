'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {cx} from 'classix';
import { Check, Play, Right, Text } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { List } from '@signalco/ui/dist/List';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { ListItem } from '../shared/ListItem';
import { KnownPages } from '../../src/knownPages';

export function Sidebar({ open, onOpenChange }: { open: boolean, onOpenChange?: (open: boolean) => void }) {
    const pathname = usePathname();

    const links = useMemo(() => [
        { href: KnownPages.Processes, label: 'Processes', Icon: Check },
        { href: KnownPages.Runs, label: 'Runs', Icon: Play },
        { href: KnownPages.Documents, label: 'Documents', Icon: Text },
    ], []);

    // Colapse if not directly in a link but in child page
    useEffect(() => {
        const shouldBeOpen = links.some(({ href }) => pathname === href);
        onOpenChange?.(shouldBeOpen);
    }, [links, onOpenChange, pathname]);

    return (
        <Stack className="group h-full py-1 pl-1" spacing={0.5}>
            <IconButton
                variant="plain"
                className={cx(
                    open ? 'opacity-0 rotate-180' : '',
                    'self-end text-muted-foreground transition-opacity group-hover:opacity-100'
                )}
                size="sm"
                onClick={() => onOpenChange?.(!open)}>
                <Right />
            </IconButton>
            <List>
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
        </Stack>
    );
}
