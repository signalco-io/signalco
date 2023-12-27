import { PropsWithChildren } from 'react';

export function EmptyLayout(props: PropsWithChildren) {
    return (
        <main className="relative h-full" {...props} />
    );
}
