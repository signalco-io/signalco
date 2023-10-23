import { cx } from 'classix';
import type { ColorVariants } from '../theme';

export type DotIndicatorProps = {
    color: ColorVariants;
    content?: React.ReactElement;
    size?: number;
}

export function DotIndicator(props: DotIndicatorProps) {
    const { color, content, size: requestedSize } = props;
    const size = requestedSize || 10;
    return (
        <div
            className={cx(
                'uitw-flex uitw-flex-col uitw-items-center uitw-justify-center uitw-text-white uitw-text-center',
                color === 'success' && 'uitw-bg-green-500',
                color === 'warning' && 'uitw-bg-yellow-500',
                color === 'danger' && 'uitw-bg-red-500',
                color === 'info' && 'uitw-bg-blue-500',
                color === 'neutral' && 'uitw-bg-slate-500'
            )}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2
            }}>
            {content}
        </div>
    )
}
