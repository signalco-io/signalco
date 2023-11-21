import { cx } from 'classix';
import { ListItem as UiListItem, type ListItemProps } from '@signalco/ui/ListItem';

export function ListItem({ className, ...rest }: ListItemProps) {
    return (
        <UiListItem
            className={cx('rounded-none gap-2 first:rounded-t-md last:rounded-b-md', className)}
            {...rest} />
    );
}
