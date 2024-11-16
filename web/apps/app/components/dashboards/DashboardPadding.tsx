import { PropsWithChildren } from 'react';

export function DashboardPadding({ children }: PropsWithChildren) {
    return (
        <div className="p-2 sm:px-2 sm:py-0">
            {children}
        </div>
    )
}