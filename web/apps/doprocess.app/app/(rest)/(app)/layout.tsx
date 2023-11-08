'use client';

import { PropsWithChildren, useState } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { PageNav } from '../../../components/PageNav';
import { SplitView } from '../../../components/layouts/SplitView';
import { Sidebar } from '../../../components/layouts/Sidebar';

export default function RootLayout({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <ClerkProvider>
            <PageNav fullWidth />
            <div className="pt-20 md:h-full">
                <SplitView
                    collapsable
                    collapsed={!sidebarOpen}
                    collapsedSize={50}
                    onCollapsedChanged={(collapsed) => setSidebarOpen(!collapsed)}
                >
                    <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
                    {children}
                </SplitView>
            </div>
        </ClerkProvider>
    );
}
