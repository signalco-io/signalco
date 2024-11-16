import { type HTMLAttributes, type ReactNode } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
    color?: 'primary' | 'neutral' | 'danger' | 'info' | 'success' | 'warning',
    startDecorator?: ReactNode | undefined,
    endDecorator?: ReactNode | undefined,
};

export function Alert({ className, color, startDecorator, endDecorator, children, ...props }: AlertProps) {
    return (
        <Row
            role="alert"
            spacing={1}
            className={cx(
                'relative w-full rounded-lg border p-4',
                '[&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:top-3.5 [&>svg]:left-4',
                color === 'primary' && 'bg-primary-100 border-primary-300',
                color === 'neutral' && 'bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700',
                color === 'danger' && 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-800',
                color === 'info' && 'bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-900',
                color === 'success' && 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700',
                color === 'warning' && 'bg-yellow-100 border-yellow-300 dark:bg-yellow-700 dark:border-yellow-600 dark:text-foreground',
                className)}
            {...props}>
            {startDecorator}
            <div className="text-sm [&_p]:leading-relaxed">
                {children}
            </div>
            {endDecorator}
        </Row>
    );
}
