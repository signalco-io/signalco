import { PropsWithChildren, ReactElement, useState } from 'react';
import { ExpandDown } from '@signalco/ui-icons';
import { Tooltip } from '../Tooltip';
import { Stack } from '../Stack';
import { Row } from '../Row';
import { ListItem } from '../ListItem/ListItem';
import { IconButton } from '../IconButton';
import { cx } from '../cx';

export type ListTreeItemProps = PropsWithChildren<{
    label?: ReactElement | string;
    nodeId: string;
    defaultOpen?: boolean;
    onChange?: (nodeId: string, open: boolean) => void;
    selected?: boolean;
    onSelected?: (nodeId: string) => void;
}>;

export function ListTreeItem({
    label, children, nodeId, defaultOpen, onChange, selected, onSelected,
}: ListTreeItemProps) {
    const [open, setOpen] = useState(defaultOpen);

    const handleOpenClick = () => {
        setOpen(!open);
        if (onChange)
            onChange(nodeId, !open);
    };

    const handleOnSelected = (selectedNodeId: string) => {
        if (onSelected) {
            onSelected(selectedNodeId);
        }
    };

    return (
        <Stack>
            <Row spacing={1}>
                <Tooltip title="Toggle" className={cx(!children && 'opacity-0')}>
                    <IconButton variant="plain" onClick={handleOpenClick} size="sm">
                        <ExpandDown className={cx('transition-transform', open && '-rotate-90')} />
                    </IconButton>
                </Tooltip>
                <ListItem
                    nodeId={nodeId}
                    label={label}
                    selected={selected}
                    onSelected={handleOnSelected} />
            </Row>
            {open && (
                <Stack>
                    {children}
                </Stack>
            )}
        </Stack>
    );
}
