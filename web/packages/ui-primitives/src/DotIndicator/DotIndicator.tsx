import type { ColorVariants } from '../theme';
import { cx } from '../cx';

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
                'flex flex-col items-center justify-center text-white text-center',
                color === 'success' && 'bg-green-500',
                color === 'warning' && 'bg-yellow-500',
                color === 'danger' && 'bg-red-500',
                color === 'info' && 'bg-blue-500',
                color === 'neutral' && 'bg-slate-500'
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
