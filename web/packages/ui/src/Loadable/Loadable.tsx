import { type PropsWithChildren, useMemo, ReactNode, CSSProperties } from 'react';
import { cx } from 'classix';
import { Warning } from '@signalco/ui-icons';
import { Spinner } from '../Spinner';
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
                <div className={cx('uitw-p-2 uitw-flex uitw-flex-col uitw-items-center', className)}>
                    <Spinner loading={true} loadingLabel={loadingLabel} />
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
            {(!contentVisible && isLoading) && (
                <>
                    {indicator}
                </>
            )}
            {contentVisible && (
                <div className={cx('uitw-h-full uitw-w-full', !isLoading && 'uitw-hidden')}>
                    {indicator}
                </div>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
