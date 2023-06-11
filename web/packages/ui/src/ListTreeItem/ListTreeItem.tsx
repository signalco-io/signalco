import { PropsWithChildren, ReactElement, useState } from 'react';
import { ExpandDown } from '@signalco/ui-icons';
import { ListItem } from '@mui/joy';
import { IconButton } from '../IconButton';
import { Tooltip } from '../Tooltip';
import { List, ListItemButton } from '../List';
import { cx } from 'classix';

export type ListTreeItemProps = PropsWithChildren<{
    label?: ReactElement | string;
    nodeId: string;
    defaultOpen?: boolean;
    onChange?: (nodeId: string, open: boolean) => void;
    selected?: boolean;
    onSelected?: (nodeId: string) => void;
}>;

export function ListTreeItem(props: ListTreeItemProps) {
    const { label, children, nodeId, defaultOpen, onChange, selected, onSelected } = props;
    const [open, setOpen] = useState(defaultOpen);

    const handleClick = () => {
        if (onSelected)
            onSelected(nodeId);
    };

    const handleOpenClick = () => {
        setOpen(!open);
        if (onChange)
            onChange(nodeId, !open);
    };

    return (
        <>
            <ListItem nested startAction={children && (
                <Tooltip title="Toggle">
                    <IconButton onClick={handleOpenClick} className={"transition-transform"} size="sm">
                        <ExpandDown className={cx(open && 'rotate-90')} />
                    </IconButton>
                </Tooltip>
            )}>
                <ListItemButton onClick={handleClick} selected={selected} disabled={!onSelected}>
                    {label}
                </ListItemButton>
                {open && (
                    <List>
                        {children}
                    </List>
                )}
            </ListItem>
        </>
    )
}
