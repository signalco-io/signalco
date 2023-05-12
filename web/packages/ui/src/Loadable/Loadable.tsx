import { type PropsWithChildren, useMemo } from 'react';
import { Alert, CircularProgress } from '@mui/joy';
import { Warning } from '@signalco/ui-icons';

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
                return <div style={{ textAlign: 'center' }}><CircularProgress aria-label={loadingLabel} /></div>
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
        return (
            <Alert variant="soft" color="danger" sx={{ width: '100%' }} startDecorator={<Warning />}>
                {errorDisplay}
            </Alert>
        );
    }

    return (
        <>
            {(contentVisible || isLoading) && (
                <div style={{ visibility: isLoading ? 'visible' : 'hidden', width: '100%', height: '100%' }}>
                    {indicator}
                </div>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
