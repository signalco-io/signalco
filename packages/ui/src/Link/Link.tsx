import NextLink from 'next/link';
import { ChildrenProps } from '../sharedTypes';

export interface LinkProps extends ChildrenProps {
    href: string;
}

export default function Link({ children, href }: LinkProps) {
    return (
        <NextLink href={href} passHref prefetch={false}>
            {children}
        </NextLink>
    );
}
