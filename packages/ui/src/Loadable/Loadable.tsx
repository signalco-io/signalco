import { useMemo } from 'react';
import { Alert, CircularProgress } from '@mui/joy';
import { ChildrenProps } from '../sharedTypes';

export interface LoadableLoadingErrorProps {
    error?: unknown | string | React.ReactElement;
    isLoading?: boolean;
}

export interface LoadableSkeletonProps {
    width?: number;
    height?: number;
}

export interface LoadableProps extends LoadableLoadingErrorProps, LoadableSkeletonProps, ChildrenProps {
    placeholder?: 'skeletonText' | 'skeletonRect' | 'circular';
    contentVisible?: boolean;
}

export default function Loadable(props: LoadableProps) {
    const { isLoading, placeholder, error, children, contentVisible } = props;

    const indicator = useMemo(() => {
        switch (placeholder) {
            case 'skeletonText':
            // return <Skeleton variant="text" width={width ?? 120} />;
            case 'skeletonRect':
            // return <Skeleton variant="rectangular" width={width ?? 120} height={height ?? 32} />;
            case 'circular':
            default:
                return <div style={{ textAlign: 'center' }}><CircularProgress /></div>
        }
    }, [placeholder]);

    if (error) {
        console.warn('User presented with error', error, typeof error);

        let errorDisplay = error as any;
        if (typeof error === 'object') {
            const errorAny = error as any;
            if (typeof errorAny.message !== 'undefined') {
                errorDisplay = errorAny.message;
            }
            else {
                errorDisplay = JSON.stringify(error);
            }
        }
        return <Alert variant="solid" color="danger">{errorDisplay}</Alert>
    }

    return (
        <>
            {(contentVisible || isLoading) && (
                <div style={{ visibility: isLoading ? 'visible' : 'hidden' }}>
                    {indicator}
                </div>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
