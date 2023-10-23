import { type PropsWithChildren, useMemo } from 'react';
import { cx } from 'classix';
import { Warning } from '@signalco/ui-icons';
import { Alert } from '../Alert';

export type LoadableLoadingErrorProps = {
    error?: unknown | string | React.ReactElement;
    isLoading?: boolean;
}

export type LoadableSkeletonProps = {
    width?: number;
    height?: number;
}

export type LoadableProps = PropsWithChildren<LoadableLoadingErrorProps & LoadableSkeletonProps & {
    placeholder?: 'skeletonText' | 'skeletonRect' | 'circular';
    contentVisible?: boolean;
    loadingLabel: string;
}>;

export function Loadable(props: LoadableProps) {
    const { isLoading, loadingLabel, placeholder, error, children, contentVisible } = props;

    const indicator = useMemo(() => {
        switch (placeholder) {
        case 'skeletonText':
            // return <Skeleton variant="text" width={width ?? 120} />;
        case 'skeletonRect':
            // return <Skeleton variant="rectangular" width={width ?? 120} height={height ?? 32} />;
        case 'circular':
        default:
            return (
                <div className="uitw-flex uitw-flex-col uitw-items-center">
                    <svg className="-uitw-ml-1 uitw-mr-3 uitw-h-8 uitw-w-8 uitw-animate-spin uitw-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label={loadingLabel}>
                        <circle className="uitw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="uitw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            );
        }
    }, [loadingLabel, placeholder]);

    if (error) {
        console.warn('User presented with error', error, typeof error);

        let errorDisplay = 'Unknown error';
        if (typeof error === 'object') {
            if ('message' in error && typeof error.message === 'string') {
                errorDisplay = error.message;
            }
            else {
                errorDisplay = JSON.stringify(error);
            }
        }
        return (
            <Alert color="danger" className="uitw-w-full" startDecorator={<Warning />}>
                {errorDisplay}
            </Alert>
        );
    }

    return (
        <>
            {(contentVisible || isLoading) && (
                <div className={cx('uitw-w-full uitw-h-full', !isLoading && 'hidden')}>
                    {indicator}
                </div>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
