import { type PropsWithChildren, useMemo, ReactNode, CSSProperties } from 'react';
import { cx } from 'classix';
import { Warning } from '@signalco/ui-icons';
import { Skeleton } from '../Skeleton';
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
    placeholder?: 'skeletonText' | 'skeletonRect' | 'circular' | ReactNode;
    contentVisible?: boolean;
    loadingLabel: string;
    className?: string;
}>;

export function Loadable({
    isLoading,
    loadingLabel,
    placeholder,
    error,
    children,
    contentVisible,
    className,
    width,
    height
}: LoadableProps) {
    const indicator = useMemo(() => {
        if (placeholder == null || placeholder === 'circular') {
            return (
                <div className={cx('uitw-flex uitw-flex-col uitw-items-center uitw-p-2', className)}>
                    <svg className="uitw-h-8 uitw-w-8 uitw-animate-spin uitw-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label={loadingLabel}>
                        <circle className="uitw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="uitw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            );
        }

        if (placeholder === 'skeletonText') {
            return (
                <Skeleton
                    className={cx('uitw-h-5 uitw-w-[--width]', className)}
                    style={{ '--width': `${width ?? 120}px`} as CSSProperties}
                />
            );
        }
        if (placeholder === 'skeletonRect') {
            return (
                <Skeleton
                    className={cx('uitw-h-[--height] uitw-w-[--width]', className)}
                    style={{ '--width': `${width ?? 120}px`, '--height': `${height ?? 32}px`} as CSSProperties}
                />
            );
        }

        return placeholder;
    }, [className, loadingLabel, placeholder, width, height]);

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
