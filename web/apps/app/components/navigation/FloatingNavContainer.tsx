import { PropsWithChildren } from 'react';
import { cx } from 'classix';

export function FloatingNavContainer({ children }: PropsWithChildren) {
    return (
        <div className={cx(
            'fixed z-10 inset-x-0 top-0 p-1 md:inset-y-0 md:left-0 md:right-auto md:p-2',
            'animate-in slide-in-from-top-16 md:slide-in-from-top-0 md:slide-in-from-left-20'
        )}>
            <div className="h-full rounded-2xl border border-border bg-card shadow-md">
                {children}
            </div>
        </div>
    );
}
