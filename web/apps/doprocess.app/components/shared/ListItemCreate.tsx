import { Add } from '@signalco/ui-icons';
import { type ListItemProps } from '@signalco/ui/dist/ListItem';
import { ListItem } from './ListItem';

export function ListItemCreate({ label, onSelected }: Required<Pick<ListItemProps, 'label' | 'onSelected'>>) {
    return (
        <ListItem
            nodeId="list-item-create"
            className={'text-muted-foreground'}
            startDecorator={<Add />}
            label={label}
            onSelected={onSelected} />
    );
}
