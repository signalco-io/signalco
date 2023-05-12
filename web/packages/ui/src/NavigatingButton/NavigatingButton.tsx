import Link from 'next/link';
import { Navigate } from '@signalco/ui-icons';
import { Button } from '../Button';
import type { PropsWithChildren } from 'react';

export type NavigatingButtonProps = PropsWithChildren<{
    href: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    hideArrow?: boolean;
}>;

export function NavigatingButton({
    href,
    size,
    disabled,
    hideArrow,
    children
}: NavigatingButtonProps) {
    return (
        <Link
            href={href}
            passHref
            aria-disabled={disabled}
            prefetch={false}>
            <Button
                color="primary"
                variant={hideArrow ? 'plain' : 'solid'}
                disabled={disabled}
                size={size}
                endDecorator={(
                    <span className='transition-opacity opacity-0 hover:opacity-1'>
                        <Navigate size={16} />
                    </span>
                )}>
                {children}
            </Button>
        </Link>
    );
}
