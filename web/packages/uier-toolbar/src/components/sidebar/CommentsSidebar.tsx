import { useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Divider } from '@signalco/ui-primitives/Divider';
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
                <div className="rounded-xl bg-card">
                    <CommentThread key={comment.id} commentItem={comment} />
                </div>
            ))}
        </Stack>
    );
}

export function CommentsSidebar({ onClose, rootElement }: CommentsSidebarProps) {
    const [filter, setFilter] = useState<CommentsFilter>();

    return (
        <div className="fixed inset-y-4 right-4 w-80 rounded-2xl border bg-black shadow-lg">
            <Stack className="h-full">
                <div className="px-4 py-3">
                    <CommentsSidebarHeader onClose={onClose} />
                </div>
                <Divider />
                <div className="p-3">
                    <CommentsSidebarFilter
                        filter={filter}
                        onFilterChange={setFilter}
                        rootElement={rootElement} />
                </div>
                <Divider />
                <div className="overflow-y-auto p-3">
                    <SidebarCommentsList />
                </div>
            </Stack>
        </div>
    );
}
