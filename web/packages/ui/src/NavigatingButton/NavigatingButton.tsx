import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { cx } from 'classix';
import { Navigate } from '@signalco/ui-icons';
import { Button } from '../Button';

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
                className={hideArrow ? 'uitw-group/nav-button' : undefined}
                startDecorator={hideArrow && (
                    <span className="uitw-w-4 uitw-pr-1" />
                )}
                endDecorator={(
                    <span className={cx(
                        'uitw-pl-1',
                        hideArrow && 'uitw-transition-opacity uitw-opacity-0 uitw-group-hover/nav-button:opacity-100'
                    )}>
                        <Navigate size={16} />
                    </span>
                )}>
                {children}
            </Button>
        </Link>
    );
}
