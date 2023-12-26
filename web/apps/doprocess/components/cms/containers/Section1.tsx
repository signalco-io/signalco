import { PropsWithChildren } from 'react';

export function Section1({ children }: PropsWithChildren) {
    return (
        <section className="flex flex-col gap-10 py-12">
            {children}
        </section>
    );
}
