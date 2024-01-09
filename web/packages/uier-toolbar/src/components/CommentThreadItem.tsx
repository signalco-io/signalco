'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { Check, MoreHorizontal } from '@signalco/ui-icons';
import { Timeago } from '@signalco/ui/Timeago';
import { CommentItemThreadItem } from './Comments';

export function CommentThreadItem({ comment, first, onDone }: { comment: CommentItemThreadItem; first?: boolean; onDone?: () => void; }) {
    const { text } = comment;
    const quote: string | undefined = comment.quotedText;
    const author = 'Guest';//comment.author;
    const avatarFallback = author[0]?.toUpperCase() ?? '';

    return (
        <Stack spacing={1}>
            <Row spacing={1} justifyContent="space-between">
                <Row spacing={0.5}>
                    <Avatar size="sm">{avatarFallback}</Avatar>
                    <Typography className="text-sm text-foreground">{author}</Typography>
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
