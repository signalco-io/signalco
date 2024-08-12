import { CSSProperties } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import styles from './Wave.module.css';

function SingleWave() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 88.7" className={cx(styles.wave, 'transition-all')}>
            <path d="M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z" />
        </svg>
    )
}

export function Wave({ value, breakpoints }: { value: number, breakpoints: readonly [number, number, number] }) {
    return (
        <div>
            <div
                className={cx(
                    styles.root,
                    'transition-all',
                    value < breakpoints[0] && 'fill-green-500',
                    value >= breakpoints[0] && value < breakpoints[1] && 'fill-lime-500 dark:fill-lime-600',
                    value >= breakpoints[1] && value < breakpoints[2] && 'fill-amber-400 dark:fill-amber-600',
                    value >= breakpoints[2] && 'fill-rose-500 dark:fill-rose-700',
                    // 'fill-red-400'
                )}
                style={{
                    '--wave-height': `${value}%`,
                } as CSSProperties}>
                <SingleWave />
                <SingleWave />
                <SingleWave />
            </div>
            <div
                className={cx(styles.background,
                    'transition-all',
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
