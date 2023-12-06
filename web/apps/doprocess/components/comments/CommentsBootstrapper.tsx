'use client';
import { CommentsGlobal } from './CommentsGlobal';
import { CommentsGlobalProps } from './Comments';


export function CommentsBootstrapper({
    reviewParamKey = 'review'
}: CommentsGlobalProps) {
    const urlInReview = new URL(window.location.href).searchParams.get(reviewParamKey) === 'true';
    console.log(urlInReview, window.location.href);
    if (!urlInReview) {
        return null;
    }

    return (
        <CommentsGlobal
            reviewParamKey={reviewParamKey} />
    );
}
