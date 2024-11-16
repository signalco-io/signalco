'use client';

import Link from 'next/link';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';

export type NavLinkProps = {
    path: string;
    Icon: React.FunctionComponent;
    active: boolean;
    label: string;
    onClick?: () => void;
};

export default function NavLink({ path, Icon, active, label, onClick }: NavLinkProps) {
    return (
        <Link href={path}>
            <IconButton
                className={cx(
                    'relative w-full text-2xl p-4',
                    'before:absolute before:right-0 before:h-[80%] before:w-0 before:opacity-0 before:bg-foreground before:rounded-sm before:transition-opacity before:transition-width before:duration-200',
                    active && 'before:opacity-100 before:w-[3px]'
                )}
                aria-label={label}
                title={label}
                variant="plain"
                size="lg"
                onClick={onClick}>
                <Icon />
            </IconButton>
        </Link>
    );
}
