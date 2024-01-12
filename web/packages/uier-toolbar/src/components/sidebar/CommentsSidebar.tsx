import { useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Divider } from '@signalco/ui-primitives/Divider';
import { cx } from '@signalco/ui-primitives/cx';
import { Collapse } from '@signalco/ui-primitives/Collapse';
import { CommentThread } from '../CommentThread';
import { useComments } from '../../hooks/useComments';
import { CommentsSidebarHeader } from './CommentsSidebarHeader';
import { CommentsSidebarFilter } from './CommentsSidebarFilter';
import { CommentsFilter } from './CommentsFilter';

export type CommentsSidebarProps = {
    onClose: () => void;
    rootElement?: HTMLElement;
};

function SidebarCommentsList() {
    const { query } = useComments();
    const { data: comments } = query;

    return (
        <Stack spacing={1}>
            {comments?.map((comment) => (
                <div className="rounded-xl border" key={comment.id}>
                    <CommentThread key={comment.id} commentItem={comment} />
                </div>
            ))}
        </Stack>
    );
}

export function CommentsSidebar({ onClose, rootElement }: CommentsSidebarProps) {
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<CommentsFilter>();
    const [hidding, setHidding] = useState<boolean>(false);

    const handleClose = () => {
        setHidding(true);
        setTimeout(() => {
            onClose();
        }, 150);
    }

    return (
        <div className={cx(
            'fixed inset-y-4 right-4 w-80 rounded-2xl border bg-black shadow-lg transition-opacity',
            'slide-in-from-right-5 fade-in ease-in-out slide-out-to-right-5 fade-out',
            hidding ? 'animate-out' : 'animate-in',
        )}>
            <Stack className="h-full">
                <div className="px-4 py-3">
                    <CommentsSidebarHeader
                        filterOpen={filterOpen}
                        onToggleFilter={() => setFilterOpen(!filterOpen)}
                        onClose={handleClose} />
                </div>
                <Collapse appear={filterOpen}>
                <Divider />
                <div className="p-3">
                    <CommentsSidebarFilter
                        filter={filter}
                        onFilterChange={setFilter}
                        rootElement={rootElement} />
                </div>
                </Collapse>
                <Divider />
                <div className="overflow-y-auto p-3">
                    <SidebarCommentsList />
                </div>
            </Stack>
        </div>
    );
}
