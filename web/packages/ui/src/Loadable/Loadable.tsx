import { type PropsWithChildren, useMemo, ReactNode, CSSProperties, ReactElement } from 'react';
import { Spinner } from '@signalco/ui-primitives/Spinner';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { cx } from '@signalco/ui-primitives/cx';
import { Warning } from '@signalco/ui-icons';
import { errorText } from '@signalco/js';
import { Alert } from '../Alert';

export type LoadableLoadingErrorProps = {
    error?: unknown | string | ReactElement;
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
                <Spinner loading={true} loadingLabel={loadingLabel} className={cx('p-2 size-10 w-full', className)} />
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
        const errorDisplay = errorText(error);
        console.warn('User presented with error:', errorDisplay, 'original error:', error);
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
