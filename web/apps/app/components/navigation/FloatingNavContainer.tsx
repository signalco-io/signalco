import { PropsWithChildren } from 'react';
import { cx } from '@signalco/ui-primitives/cx';

export function FloatingNavContainer({ children }: PropsWithChildren) {
    return (
        <nav className={cx(
            'fixed z-10 inset-x-0 top-0 p-2 sm:inset-y-0 sm:left-0 sm:right-auto sm:p-2',
            'animate-in slide-in-from-top-16 sm:slide-in-from-top-0 sm:slide-in-from-left-20',
        )}>
            <div className="h-full rounded-lg border bg-card-transparent/30 shadow-md backdrop-blur-md">
                {children}
            </div>
        </nav>
    );
}
