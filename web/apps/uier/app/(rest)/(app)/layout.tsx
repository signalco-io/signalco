import { PropsWithChildren } from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="md:h-full">
                {children}
            </div>
        </>
    );
}
