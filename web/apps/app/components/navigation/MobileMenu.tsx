'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Stack } from '@signalco/ui-primitives/Stack';
import { IconButton, IconButtonProps } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { Close, Menu } from '@signalco/ui-icons';
import useLocale from '../../src/hooks/useLocale';
import { NavItem } from './NavProfile';

type MobileMenuProps = Omit<IconButtonProps, 'type' | 'onClick' | 'children'> & {
    items: NavItem[];
    active?: NavItem;
};

export function MobileMenu({
    items, active, ...rest
}: MobileMenuProps) {
    const { t } = useLocale('App', 'Nav');
    const [open, setOpen] = useState(false);
    const [hidding, setHidding] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen(true);
        setHidding(false);
    }

    const handleClose = () => {
        setHidding(true);
        setTimeout(() => {
            setOpen(false);
        }, 150);
    }

    return (
        <>
            <IconButton
                variant="plain"
                onClick={() => open ? handleClose() : handleOpen()}
                aria-label="Toggle menu"
                type="button"
                {...rest}>
                {open ? <Close /> : <Menu />}
            </IconButton>
            {open && (
                <div className={cx(
                    'p-2',
                    'slide-in-from-top-3 slide-out-to-top-3 fade-in fade-out ease-in-out',
                    hidding ? 'animate-out' : 'animate-in',
                )}>
                    <Stack>
                        {items.map((ni, index) => (
                            <Link href={ni.path} key={index + 1}>
                                <Button
                                    fullWidth
                                    title={t(ni.label)}
                                    key={index + 1}
                                    aria-label={t(ni.label)}
                                    variant={ni === active ? 'soft' : 'plain'}
                                    size="lg"
                                    onClick={handleClose}
                                    startDecorator={(<ni.icon />)}>
                                    {ni.label}
                                </Button>
                            </Link>
                        ))}
                    </Stack>
                </div>
            )}
        </>
    );
}
