'use client';

import { PropsWithChildren, useState } from 'react';
import { SplitView } from '../../../components/layouts/SplitView';
import { Sidebar } from '../../../components/layouts/Sidebar';

export default function RootLayout({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <SplitView
            collapsable
            collapsed={!sidebarOpen}
            collapsedSize={50}
            onCollapsedChanged={(collapsed) => setSidebarOpen(!collapsed)}
        >
            <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
            {children}
        </SplitView>
    );
}
