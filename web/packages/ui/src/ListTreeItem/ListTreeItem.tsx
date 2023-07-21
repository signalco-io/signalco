import { PropsWithChildren, ReactElement, useState } from 'react';
import { cx } from 'classix';
import { ExpandDown } from '@signalco/ui-icons';
import { Tooltip } from '../Tooltip';
import { Stack } from '../Stack';
import { Row } from '../Row';
import { ListItem } from '../ListItem/ListItem';
import { IconButton } from '../IconButton';

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
                <Tooltip title="Toggle">
                    <IconButton onClick={handleOpenClick} className={'transition-transform'} size="sm">
                        <ExpandDown className={cx(open && 'rotate-90')} />
                    </IconButton>
                </Tooltip>
                <ListItem
                    nodeId={nodeId}
                    label={label}
                    selected={selected}
                    onSelected={handleOnSelected}
                    disabled={!onSelected} />
            </Row>
            {open && (
                <Stack>
                    {children}
                </Stack>
            )}
        </Stack>
    );
}
