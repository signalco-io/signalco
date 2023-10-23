import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from 'classix';
import { Row } from '../Row';

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
                'uitw-relative uitw-w-full uitw-rounded-lg uitw-border p-4 [&>svg~*]:uitw-pl-7 [&>svg+div]:uitw-translate-y-[-3px] [&>svg]:uitw-absolute [&>svg]:uitw-left-4 [&>svg]:uitw-top-4 [&>svg]:uitw-text-foreground',
                color === 'primary' && 'uitw-bg-primary-100 uitw-border-primary-300',
                color === 'neutral' && 'uitw-bg-neutral-100 uitw-border-neutral-300',
                color === 'danger' && 'uitw-bg-red-100 uitw-border-red-300',
                color === 'info' && 'uitw-bg-blue-100 uitw-border-blue-300',
                color === 'success' && 'uitw-bg-green-100 uitw-border-green-300',
                color === 'warning' && 'uitw-bg-yellow-100 uitw-border-yellow-300',
                className)}
            {...props}>
            {startDecorator}
            <div className="uitw-text-sm [&_p]:uitw-leading-relaxed">
                {children}
            </div>
            {endDecorator}
        </Row>
    );
}
