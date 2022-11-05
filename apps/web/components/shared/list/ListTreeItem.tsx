import { ReactElement, useState } from 'react';
import { ExpandDown } from '@signalco/ui-icons';
import { IconButton, List, ListItem, ListItemButton } from '@mui/joy';
import { ChildrenProps } from 'src/sharedTypes';

export interface ListTreeItemProps extends ChildrenProps {
    label?: ReactElement | string;
    nodeId: string;
    onChange?: (nodeId: string, open: boolean) => void;
    selected?: boolean;
    onSelected?: (nodeId: string) => void;
}

export default function ListTreeItem(props: ListTreeItemProps) {
    const { label, children, nodeId, onChange, selected, onSelected } = props;
    const [open, setOpen] = useState(false);

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
                <IconButton onClick={handleOpenClick}>
                    <ExpandDown />
                </IconButton>
            )}>
                <ListItemButton onClick={handleClick} selected={selected}>
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
