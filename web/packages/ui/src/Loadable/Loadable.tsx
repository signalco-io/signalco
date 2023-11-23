import { type PropsWithChildren, useMemo, ReactNode, CSSProperties } from 'react';
import { Spinner } from '@signalco/ui-primitives/Spinner';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { cx } from '@signalco/ui-primitives/cx';
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
                <div className={cx('p-2 flex flex-col items-center', className)}>
                    <Spinner loading={true} loadingLabel={loadingLabel} />
                </div>
            );
        }

        if (placeholder === 'skeletonText') {
            return (
                <Skeleton
                    className={cx('h-5 w-[--width]', className)}
                    style={{ '--width': `${width ?? 120}px`} as CSSProperties}
                />
            );
        }
        if (placeholder === 'skeletonRect') {
            return (
                <Skeleton
                    className={cx('h-[--height] w-[--width]', className)}
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
            <Alert color="danger" className="w-full" startDecorator={<Warning />}>
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
                <div className={cx('h-full w-full', !isLoading && 'hidden')}>
                    {indicator}
                </div>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
