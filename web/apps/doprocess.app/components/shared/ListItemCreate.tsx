import { Add } from '@signalco/ui-icons';
import { Spinner } from '@signalco/ui/dist/Spinner';
import { type ListItemProps } from '@signalco/ui/dist/ListItem';
import { ListItem } from './ListItem';

export function ListItemCreate({ loading, label, onSelected }: Required<Pick<ListItemProps, 'label' | 'onSelected'>> & { loading?: boolean }) {
    return (
        <ListItem
            nodeId="list-item-create"
            className={'text-muted-foreground'}
            startDecorator={<Add />}
            endDecorator={<Spinner loading={loading} loadingLabel="Creating..." className="h-5 w-5 self-start" />}
            label={label}
            onSelected={onSelected} />
    );
}
