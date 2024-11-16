import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '@signalco/ui-primitives/cx';

function SingleWave() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 88.7"
            className={cx(
                'absolute [transform:translate3d(0,0,0)] transition-all w-[200%] h-full',
                '[&:nth-of-type(1)]:opacity-80 [&:nth-of-type(1)]:animate-wave1',
                '[&:nth-of-type(2)]:opacity-50 [&:nth-of-type(2)]:bottom-0 [&:nth-of-type(2)]:animate-wave2',
                '[&:nth-of-type(3)]:opacity-50 [&:nth-of-type(3)]:bottom-0 [&:nth-of-type(3)]:animate-wave3',
            )}>
            <path d="M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z" />
        </svg>
    )
}

export type WaveProps = HTMLAttributes<HTMLDivElement> & {
    value: number,
    breakpoints: readonly [number, number, number]
};

export function Wave({ value, breakpoints, ...rest }: WaveProps) {
    return (
        <div {...rest}>
            <div
                className={cx(
                    'transition-all',
                    'absolute w-full h-5 left-0 right-0 bottom-[--wave-height] overflow-x-hidden',
                    value < breakpoints[0] && 'fill-green-500',
                    value >= breakpoints[0] && value < breakpoints[1] && 'fill-lime-500 dark:fill-lime-600',
                    value >= breakpoints[1] && value < breakpoints[2] && 'fill-amber-400 dark:fill-amber-600',
                    value >= breakpoints[2] && 'fill-rose-500 dark:fill-rose-700',
                )}
                style={{
                    '--wave-height': `${value}%`,
                } as CSSProperties}>
                <SingleWave />
                <SingleWave />
                <SingleWave />
            </div>
            <div
                className={cx(
                    'transition-all',
                    'absolute w-full h-[calc(var(--wave-height)+7px)] left-0 right-0 bottom-0 overflow-x-hidden',
                    value < breakpoints[0] && 'bg-green-400 dark:bg-green-500',
                    value >= breakpoints[0] && value < breakpoints[1] && 'bg-lime-400 dark:bg-lime-600',
                    value >= breakpoints[1] && value < breakpoints[2] && 'bg-amber-400 dark:bg-amber-600',
                    value >= breakpoints[2] && 'bg-rose-500 dark:bg-rose-700',
                )}
                style={{
                    '--wave-height': `${value}%`
                } as CSSProperties}></div>
        </div>
    );
}
