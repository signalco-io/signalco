import { ListItem as UiListItem, type ListItemProps } from '@signalco/ui-primitives/ListItem';
import { cx } from '@signalco/ui-primitives/cx';

export function QueryListItem({ className, ...rest }: ListItemProps) {
    return (
        <UiListItem
            className={cx('rounded-none gap-2 first:rounded-t-[calc(var(--radius)-1px)] last:rounded-b-[calc(var(--radius)-1px)]', className)}
            {...rest} />
    );
}
