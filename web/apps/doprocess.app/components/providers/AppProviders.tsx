'use client';

import { PropsWithChildren, useMemo, useState } from 'react';
import { SidebarContext } from '../../src/contexts/SidebarContext';

export function AppProviders({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const sidebarContextValue = useMemo(() => ({
        open: sidebarOpen,
        setOpen: setSidebarOpen
    }), [sidebarOpen]);

    return (
        <SidebarContext.Provider value={sidebarContextValue}>
            {children}
        </SidebarContext.Provider>
    );
}
