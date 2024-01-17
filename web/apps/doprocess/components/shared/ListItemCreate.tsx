import { Spinner } from '@signalco/ui-primitives/Spinner';
import { type ListItemProps } from '@signalco/ui-primitives/ListItem';
import { Add } from '@signalco/ui-icons';
import { ListItem } from './ListItem';

export function ListItemCreate({ loading, label, onSelected }: Required<Pick<ListItemProps, 'label' | 'onSelected'>> & { loading?: boolean }) {
    return (
        <ListItem
            nodeId="list-item-create"
            className={'text-muted-foreground'}
            startDecorator={<Add />}
            endDecorator={<Spinner loading={loading} loadingLabel="Creating..." className="size-5 self-start" />}
            label={label}
            onSelected={onSelected} />
    );
}
