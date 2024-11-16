import { PropsWithChildren } from 'react';

export function Section3({ children }: PropsWithChildren) {
    return (
        <section className="py-12">
            {children}
        </section>
    );
}
