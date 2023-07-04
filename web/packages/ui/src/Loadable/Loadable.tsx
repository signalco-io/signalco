import { type PropsWithChildren, useMemo } from 'react';
import { Alert } from '../Alert';
import { Warning } from '@signalco/ui-icons';
import { cx } from 'classix';

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
                    <div style={{ textAlign: 'center' }}>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label={loadingLabel}>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                );
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
            <Alert variant="soft" color="danger" className="w-full" startDecorator={<Warning />}>
                {errorDisplay}
            </Alert>
        );
    }

    return (
        <>
            {(contentVisible || isLoading) && (
                <div className={cx("w-full h-full", !isLoading && 'hidden')}>
                    {indicator}
                </div>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
