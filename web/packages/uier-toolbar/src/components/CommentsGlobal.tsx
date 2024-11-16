import { useState } from 'react';
import { getElementSelector } from '@signalco/js';
import { useWindowEvent } from '@signalco/hooks/useWindowEvent';
import { useDocumentEvent } from '@signalco/hooks/useDocumentEvent';
import { useComments } from '../hooks/useComments';
import { useCommentItemRects } from '../hooks/useCommentItemRects';
import { CommentsSidebar } from './sidebar/CommentsSidebar';
import { CommentToolbar } from './CommentToolbar';
import { CommentSelectionPopover } from './CommentSelectionPopover';
import { CommentSelectionHighlight } from './CommentSelectionHighlight';
import { CommentPointOverlay } from './CommentPointOverlay';
import { CommentBubble } from './CommentBubble';
import { CommentsGlobalProps, CommentSelection, CommentPoint, CommentItem } from './@types/Comments';

export function CommentsGlobal({
    reviewParamKey = 'review',
    rootElement
}: CommentsGlobalProps) {
    const [creatingCommentSelection, setCreatingCommentSelection] = useState<CommentSelection>();
    const [creatingComment, setCreatingComment] = useState<CommentItem>();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { query: commentItems } = useComments();

    const [creatingCommentPoint, setCreatingCommentPoint] = useState(false);

    useWindowEvent('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && (creatingCommentSelection || creatingCommentPoint)) {
            event.stopPropagation();
            event.preventDefault();
            setCreatingCommentPoint(false);
            setCreatingCommentSelection(undefined);
        }
    }, [creatingCommentSelection, creatingCommentPoint]);

    useDocumentEvent('selectionchange', () => {
        // Ignore if selection is empty or no selection in document
        const selection = window.getSelection();
        const text = selection?.toString();
        if (!selection || !text?.length) {
            setCreatingCommentSelection(undefined);
            return;
        }

        setCreatingCommentSelection({
            text,
            type: 'text',
            startSelector: getElementSelector(selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement),
            startOffset: selection.anchorOffset,
            startType: selection.anchorNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element',
            endSelector: getElementSelector(selection.focusNode instanceof Element ? selection.focusNode : selection.focusNode?.parentElement),
            endOffset: selection.focusOffset,
            endType: selection.focusNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element'
        });
    });

    const creatingSelectionRects = useCommentItemRects(creatingCommentSelection);

    const handleCreateComment = async () => {
        if (!creatingCommentSelection) {
            return;
        }

        setCreatingCommentSelection(undefined);
        setCreatingComment({
            position: creatingCommentSelection,
            thread: { items: [] },
            device: {
                size: window.innerWidth >= 1024 ? 'desktop' : (window.innerWidth >= 768 ? 'tablet' : 'mobile'),

            }
        });
    };

    const handleCreateCommentPoint = async (commentPoint: CommentPoint) => {
        setCreatingCommentPoint(false);
        setCreatingComment({
            position: commentPoint,
            thread: { items: [] },
            device: {
                size: window.innerWidth >= 1024 ? 'desktop' : (window.innerWidth >= 768 ? 'tablet' : 'mobile'),
                pixelRatio: window.devicePixelRatio,
                os: (navigator as any).userAgentData?.platform,
                browser: `${(navigator as any).userAgentData?.brands?.at(-1)?.brand} (${(navigator as any).userAgentData?.brands?.at(-1)?.version})`,
                userAgent: navigator.userAgent,
                windowSize: [window.innerWidth, window.innerHeight]
            }
        });
    };

    const handleExitReview = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete(reviewParamKey);
        window.history.replaceState({}, '', url.toString());
    };

    return (
        <>
            {(creatingComment ? [...(commentItems.data ?? []), creatingComment] : (commentItems.data ?? [])).map((commentItem) => {
                console.log('creating comment id', commentItem.id)
                return (
                    <CommentBubble
                        key={commentItem.id ?? 'new'}
                        commentItem={commentItem}
                        creating={!commentItem.id}
                        onCreated={() => setCreatingComment(undefined)}
                        onCanceled={() => setCreatingComment(undefined)} />
                );
            })}
            {creatingCommentSelection && (
                <CommentSelectionHighlight commentSelection={creatingCommentSelection} />
            )}
            {creatingSelectionRects?.length > 0 && (
                <CommentSelectionPopover
                    rects={creatingSelectionRects}
                    onCreate={handleCreateComment} />
            )}
            {creatingCommentPoint && (
                <CommentPointOverlay onPoint={handleCreateCommentPoint} />
            )}
            {sidebarOpen && (
                <CommentsSidebar
                    onClose={() => setSidebarOpen(false)}
                    rootElement={rootElement}
                />
            )}
            <CommentToolbar
                creatingPointComment={creatingCommentPoint}
                onAddPointComment={() => setCreatingCommentPoint((curr) => !curr)}
                onShowSidebar={() => setSidebarOpen(true)}
                onExitReview={handleExitReview} />
        </>
    );
}
