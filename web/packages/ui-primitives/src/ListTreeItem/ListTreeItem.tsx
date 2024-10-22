'use client';

import { PropsWithChildren, useId, useState } from 'react';
import { Navigate } from '@signalco/ui-icons';
import { Stack } from '../Stack';
import { Row } from '../Row';
import { ListItem, ListItemProps } from '../ListItem/ListItem';
import { IconButton } from '../IconButton';
import { cx } from '../cx';

export type ListTreeItemProps = PropsWithChildren<{
    defaultOpen?: boolean;
    onChange?: (nodeId: string | undefined, open: boolean) => void;
    side?: 'start' | 'end';
    disablePadding?: boolean;
} & ListItemProps>;

export function ListTreeItem({
    children,
    defaultOpen,
    side = 'start',
    disablePadding,
    onChange,
    ...rest
}: ListTreeItemProps) {
    const id = useId();
    const [open, setOpen] = useState(defaultOpen);

    const handleOpenClick = () => {
        setOpen(!open);
        if (onChange)
            onChange(rest.nodeId, !open);
    };

    return (
        <Stack>
            <Row className={cx(side === 'end' && 'flex-row-reverse')}>
                {!rest.href && !rest.onSelected && !rest.nodeId ? (
                    <ListItem
                        nodeId={id}
                        onSelected={handleOpenClick}
                        label={rest.label}
                        startDecorator={(
                            <Row>
                                {(Boolean(children) && side === 'start') && (
                                    <Navigate className={cx('mr-4 transition-transform size-4', open && 'rotate-90')} />
                                )}
                                <>
                                    {rest.startDecorator}
                                </>
                            </Row>
                        )}
                        endDecorator={(
                            <Row>
                                {(Boolean(children) && side === 'end') && (
                                    <Navigate className={cx('ml-4 transition-transform size-4', open && 'rotate-90')} />
                                )}
                                <>
                                    {rest.endDecorator}
                                </>
                            </Row>
                        )}
                        disabled={rest.disabled}
                        className={rest.className}
                        title={rest.title}
                        style={rest.style}
                        variant={rest.variant}
                    />
                ) : (
                    <>
                        <IconButton variant="plain" onClick={handleOpenClick} size="sm" title="Toggle open/close" className={cx(!children && (side === 'end' ? 'hidden' : 'opacity-0'))}>
                            <Navigate className={cx('transition-transform', open && 'rotate-90')} />
                        </IconButton>
                        <ListItem {...rest} />
                    </>
                )}
            </Row>
            {open && (
                <Stack className={cx(!disablePadding && 'pl-9')}>
                    {children}
                </Stack>
            )}
        </Stack>
    );
}
