import { Spinner } from '@signalco/ui-primitives/Spinner';
import { ListItem, type ListItemProps } from '@signalco/ui-primitives/ListItem';
import { cx } from '@signalco/ui-primitives/cx';
import { Add } from '@signalco/ui-icons';

export type QueryListeItemCreateProps =
    Required<Pick<ListItemProps, 'label' | 'onSelected'>> &
    Omit<ListItemProps, 'nodeId' | 'startDecorator' | 'endDecorator' | 'href' | 'divRef' | 'buttonRef'> & {
        loading?: boolean
    };

export function QueryListItemCreate({ loading, className, ...rest }: QueryListeItemCreateProps) {
    return (
        <ListItem
            nodeId="list-item-create"
            className={cx('text-muted-foreground', className)}
            startDecorator={<Add className="w-5" />}
            endDecorator={<Spinner loading={loading} loadingLabel="Creating..." className="size-5 self-start" />}
            {...rest} />
    );
}
