import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Link as RELink } from '@react-email/components';

export function Link({ children, href }: PropsWithChildren<{ href: string; }>) {
    return (
        <RELink
            href={href}
            className="text-blue-600 no-underline"
        >
            {children}
        </RELink>
    );
}
