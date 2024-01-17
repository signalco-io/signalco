'use client';

import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Inbox, Menu } from '@signalco/ui-icons';
import { CommentIcon } from './CommentIcon';

type CommentToolbarProps = {
    creatingPointComment: boolean;
    onAddPointComment: () => void;
    onShowSidebar: () => void;
    onExitReview: () => void;
};

export function CommentToolbar({ creatingPointComment, onAddPointComment, onShowSidebar, onExitReview }: CommentToolbarProps) {
    return (
        <div className="fixed bottom-4 left-1/2 z-[51] -translate-x-1/2 rounded-full border bg-black p-1">
            <Row>
                <Tooltip title="Add comment">
                    <IconButton variant={creatingPointComment ? 'soft' : 'plain'} className="rounded-full" onClick={onAddPointComment}>
                        <CommentIcon icon="add" size={24} variant="outlined" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Inbox">
                    <IconButton variant="plain" className="rounded-full" onClick={onShowSidebar}>
                        <Inbox />
                    </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flex className="my-2" />
                <Tooltip title="Toolbar menu">
                    <IconButton variant="plain" className="rounded-full" onClick={onExitReview}>
                        <Menu />
                    </IconButton>
                </Tooltip>
            </Row>
        </div>
    );
}
