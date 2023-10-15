import { PropsWithChildren } from 'react';
import { cx } from 'classix';

export function FloatingNavContainer({ children }: PropsWithChildren) {
    return (
        <div className={cx(
            'fixed z-10 inset-x-0 top-0 p-2 sm:inset-y-0 sm:left-0 sm:right-auto sm:p-2',
            'animate-in slide-in-from-top-16 sm:slide-in-from-top-0 sm:slide-in-from-left-20'
        )}>
            <div className="h-full rounded-2xl border bg-card shadow-md">
                {children}
            </div>
        </div>
    );
}
