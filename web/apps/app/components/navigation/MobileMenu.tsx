'use client';

import Link from 'next/link';
import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import useLocale from '../../src/hooks/useLocale';
import { NavItem } from './NavProfile';

export function MobileMenu({ open, items, active, onClose }: { open: boolean; items: NavItem[]; active?: NavItem; onClose: () => void; }) {
    const { t } = useLocale('App', 'Nav');

    return (
        <div className={cx(
            'p-2',
            !open && 'hidden',
            open && 'animate-in slide-in-from-top-3'
        )}>
            <Stack>
                {items.map((ni, index) => {
                    const Icon = ni.icon;

                    return (
                        <Tooltip title={t(ni.label)} key={index + 1}>
                            <Link href={ni.path}>
                                <Button
                                    fullWidth
                                    aria-label={t(ni.label)}
                                    variant={ni === active ? 'soft' : 'plain'}
                                    size="lg"
                                    onClick={onClose}
                                    startDecorator={(<Icon />)}>
                                    {ni.label}
                                </Button>
                            </Link>
                        </Tooltip>
                    );
                })}
            </Stack>
        </div>
    );
}
