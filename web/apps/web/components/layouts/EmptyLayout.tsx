import { PropsWithChildren } from 'react';

export function EmptyLayout(props: PropsWithChildren) {
    const {
        children
    } = props;

    return (
        <div className="relative h-full">
            {children}
        </div>
    );
}
