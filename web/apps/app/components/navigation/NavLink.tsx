'use client';

import Link from 'next/link';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import styles from './NavLink.module.scss';

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
                className={cx(styles.root, 'relative', active && styles.active)}
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
