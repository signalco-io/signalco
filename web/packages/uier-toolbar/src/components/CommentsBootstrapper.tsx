import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommentsGlobal } from './CommentsGlobal';
import { CommentsBootstrapperContext } from './CommentsBootstrapperContext';
import { CommentsGlobalProps } from './@types/Comments';

const queryClient = new QueryClient();

export function CommentsBootstrapper({
    reviewParamKey,
    rootElement
}: CommentsGlobalProps) {
    return (
        <CommentsBootstrapperContext.Provider value={{ rootElement }}>
            <QueryClientProvider client={queryClient}>
                <CommentsGlobal
                    reviewParamKey={reviewParamKey}
                    rootElement={rootElement} />
            </QueryClientProvider>
        </CommentsBootstrapperContext.Provider>
    );
}
