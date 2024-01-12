'use client';

import { useContext, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { Check, Desktop, Mobile, MoreHorizontal, Tablet } from '@signalco/ui-icons';
import { Timeago } from '@signalco/ui/Timeago';
import { camelToSentenceCase } from '@signalco/js';
import { CommentsBootstrapperContext } from './CommentsBootstrapperContext';
import { CommentItem, CommentItemThreadItem } from './Comments';

function DeviceInfo({ device }: { device?: CommentItem['device'] }) {
    const { rootElement } = useContext(CommentsBootstrapperContext);
    const [open, setOpen] = useState(false);
    const deviceSize = device?.size;
    const DeviceSizeIcon = deviceSize === 'desktop'
        ? Desktop
        : (deviceSize === 'tablet'
            ? Tablet
            : (deviceSize === 'mobile'
                ? Mobile
                : null));

    if (!DeviceSizeIcon) return null;

    return (
        <Popper
            open={open}
            // onMouseLeave={() => setOpen(false)}
            container={rootElement}
            anchor={(
                <DeviceSizeIcon size={14} className="text-secondary-foreground" onMouseEnter={() => setOpen(true)} />
            )}>
            <Stack spacing={0.5} className="rounded-md px-2 py-1 text-background">
                {device?.browser && <Typography level="body2" title={device.userAgent}>{device.browser}</Typography>}
                {device?.os && <Typography level="body2">{device.os}</Typography>}
                {deviceSize && <Typography level="body2">{camelToSentenceCase(deviceSize)}</Typography>}
                {device?.windowSize && <Typography level="body2">{device.windowSize[0]}x{device.windowSize[1]}</Typography>}
                {device?.pixelRatio && <Typography level="body2">(x{device.pixelRatio})</Typography>}
            </Stack>
        </Popper>
    );
}

export function CommentThreadItem({ comment, threadItem, first, onDone }: { comment: CommentItem, threadItem: CommentItemThreadItem; first?: boolean; onDone?: () => void; }) {
    const { text } = threadItem;
    const quote: string | undefined = threadItem.quotedText;
    const author = 'Guest';//comment.author;
    const avatarFallback = author[0]?.toUpperCase() ?? '';

    return (
        <Stack spacing={1}>
            <Row spacing={1} justifyContent="space-between">
                <Row spacing={0.5}>
                    <Avatar size="sm">{avatarFallback}</Avatar>
                    <Typography className="text-sm text-foreground">{author}</Typography>
                    {first && (
                        <DeviceInfo device={comment.device} />
                    )}
                    <span className="text-sm text-secondary-foreground">
                        <Timeago format="nano" date={new Date()} />
                    </span>
                </Row>
                <Row>
                    {first && (
                        <IconButton size="xs" variant="plain" title="Mark as Done" onClick={onDone}>
                            <Check />
                        </IconButton>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <IconButton size="xs" variant="plain">
                                <MoreHorizontal />
                            </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Row>
            </Row>
            {Boolean(quote?.length) && (
                <div className="border-l-2 border-muted-foreground bg-muted px-2 py-1 text-sm">
                    {quote}
                </div>
            )}
            <Typography level="body1">{text}</Typography>
        </Stack>
    );
}
