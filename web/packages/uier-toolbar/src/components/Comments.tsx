export const popoverWidth = 288;
export const popoverWindowMargin = 8;

export type CommentPoint = {
    type: 'point';
    selector: string;
    xNormal: number;
    yNormal: number;
};

export type CommentSelection = {
    type: 'text';
    text: string;
    startSelector: string;
    startOffset: number;
    startType: 'text' | 'element';
    endSelector?: string;
    endOffset: number;
    endType: 'text' | 'element';
}

export type CommentItemPosition = CommentPoint | CommentSelection;

export type CommentItemThreadItem = {
    id: string;
    text: string;
}

export type CommentItemThread = {
    items: CommentItemThreadItem[];
}

export type CommentItem = {
    id?: string;
    position: CommentPoint | CommentSelection;
    thread: CommentItemThread;
    resolved?: boolean;
}

export type CommentsGlobalProps = {
    reviewParamKey?: string;
}
