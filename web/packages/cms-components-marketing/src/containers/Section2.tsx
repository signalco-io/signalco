import { PropsWithChildren } from 'react';

export function Section2({ children }: PropsWithChildren) {
    return (
        <section className="grid grid-flow-row gap-10 py-12 lg:grid-cols-2">
            {children}
        </section>
    );
}
