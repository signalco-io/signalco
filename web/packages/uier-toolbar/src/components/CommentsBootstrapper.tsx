'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommentsGlobal } from './CommentsGlobal';
import { CommentsGlobalProps } from './Comments';

const queryClient = new QueryClient();

export function CommentsBootstrapper({
    reviewParamKey = 'review'
}: CommentsGlobalProps) {
    const urlInReview = new URL(window.location.href).searchParams.get(reviewParamKey) === 'true';
    console.log(urlInReview, window.location.href);
    if (!urlInReview) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <CommentsGlobal
                reviewParamKey={reviewParamKey} />
        </QueryClientProvider>
    );
}
