import { PropsWithChildren } from 'react';

export function EmptyLayout(props: PropsWithChildren) {
    const {
        children
    } = props;

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            {children}
        </div>
    );
}
