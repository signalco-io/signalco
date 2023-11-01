'use client';
import { Add } from '@signalco/ui-icons';
import { ListItem } from '@signalco/ui/dist/ListItem';

export function ListItemCreate({ label, onSelected }: { label: string; onSelected: () => void; }) {
    return (
        <ListItem
            nodeId="new-list-item"
            className="rounded-none text-muted-foreground"
            startDecorator={<Add />}
            label={label}
            onSelected={onSelected} />
    );
}
