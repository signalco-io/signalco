import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from 'classix';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
    color?: 'primary' | 'neutral' | 'danger' | 'info' | 'success' | 'warning',
    startDecorator?: ReactNode | undefined,
    endDecorator?: ReactNode | undefined,
};

export function Alert({ color, startDecorator, endDecorator, className, ...props }: AlertProps) {
    return (
        <div
            role="alert"
            // color={color}
            // startDecorator={startDecorator}
            // endDecorator={endDecorator}
            className={cx('', className)}
            {...props} />
    );
}
