'use client';

import Link from 'next/link';
import { cx } from 'classix';
import { IconButton, Tooltip } from '@signalco/ui';
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
        <Tooltip title={label} placement="right">
            <Link href={path}>
                <IconButton
                    className={cx(styles.root, active && styles.active)}
                    aria-label={label}
                    title={label}
                    variant="plain"
                    size="lg"
                    onClick={onClick}>
                    <Icon />
                </IconButton>
            </Link>
        </Tooltip>
    );
}
