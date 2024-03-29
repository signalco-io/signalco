import { PropsWithChildren } from 'react';

export function Section1({ children }: PropsWithChildren) {
    return (
        <section className="grid grid-flow-row items-center gap-10 py-12 lg:grid-cols-2">
            {children}
        </section>
    );
}
