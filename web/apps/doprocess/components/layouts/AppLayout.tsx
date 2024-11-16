'use client';

import { PropsWithChildren, useContext } from 'react';
import { SplitView } from '@signalco/ui/SplitView';
import { SidebarContext } from '../../src/contexts/SidebarContext';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: PropsWithChildren) {
    const { open, setOpen } = useContext(SidebarContext);

    return (
        <SplitView
            collapsable
            collapsed={!open}
            collapsedSize={50}
            onCollapsedChanged={(collapsed) => setOpen(!collapsed)}
        >
            <Sidebar open={open} onOpenChange={setOpen} />
            {children}
        </SplitView>
    );
}
