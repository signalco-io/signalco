import { cx } from 'classix';
import { ListItem as UiListItem, type ListItemProps } from '@signalco/ui/dist/ListItem';

export function ListItem({ className, ...rest }: ListItemProps) {
    return (
        <UiListItem
            className={cx('rounded-none', className)}
            {...rest} />
    );
}
