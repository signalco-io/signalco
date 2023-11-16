import { PropsWithChildren } from 'react';
import '../global.css';

export default function EmbeddedLayout({children}: PropsWithChildren) {
    return (
        <>
            {children}
        </>
    )
}
