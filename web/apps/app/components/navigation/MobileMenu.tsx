import { cx } from 'classix';
import { Stack } from '@signalco/ui/dist/Stack';
import useLocale from '../../src/hooks/useLocale';
import { NavItem } from './NavProfile';
import NavLink from './NavLink';

export function MobileMenu({ open, items, active, onClose }: { open: boolean; items: NavItem[]; active?: NavItem; onClose: () => void; }) {
    const { t } = useLocale('App', 'Nav');

    return (
        <div className={cx(
            'fixed inset-0 top-[60px] z-50 bg-white',
            !open && 'hidden'
        )}>
            <Stack>
                {items.map((ni, index) => (
                    <NavLink
                        key={index + 1}
                        path={ni.path}
                        Icon={ni.icon}
                        active={ni === active}
                        label={t(ni.label)}
                        onClick={onClose} />))}
            </Stack>
        </div>
    );
}
