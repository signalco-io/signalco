import { PropsWithChildren } from 'react';

export function SplitView({ children}: PropsWithChildren) {
    return (
        <div className="h-full">
            <div className="grid h-full grid-cols-[1fr_2fr] [&>*:nth-child(1)]:border-r">
                {children}
            </div>
        </div>
    );
}
