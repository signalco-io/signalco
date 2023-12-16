'use client';

import { usePathname } from 'next/navigation';
import { orderBy } from '@signalco/js';
import { NavItem, navItems } from './NavProfile';

export function useActiveNavItem(): NavItem | undefined {
    const pathname = usePathname();
    return orderBy(navItems.filter(ni => pathname?.startsWith(ni.path)), (a, b) => b.path.length - a.path.length).at(0);
}
