import { PropsWithChildren } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { AppSidebarUsage } from './AppSidebarUsage';
import { AppSidebarProfileButton } from './AppSidebarProfileButton';

export function AppSidebar({ children }: PropsWithChildren) {
    return (
        <div className={cx('select-none grid h-screen w-full grid-rows-[auto_auto_auto_1fr_auto] gap-2 overflow-hidden')}>
            <div className="p-2">
                <AppSidebarProfileButton />
            </div>
            {children}
            <AppSidebarUsage />
        </div>
    );
}
