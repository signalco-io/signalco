import React from 'react';
import { forwardRef, type HTMLAttributes } from 'react';
import { slug } from '@signalco/js';
import { Stack } from '../Stack';
import { Row, RowProps } from '../Row';
import { Divider } from '../Divider';
import { cx } from '../cx';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    href?: string;
    variant?: 'default' | 'secondary';
};

const Card = forwardRef<HTMLDivElement, CardProps>(({ href, onClick, className, variant, ...restProps }: CardProps, ref) => {
    const handleOnClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (onClick) {
            onClick(event);
        } else if (href) {
            event.preventDefault();
            event.stopPropagation();
            window.location.href = href;
        }
    }

    return (
        <div
            ref={ref}
            role={onClick ? 'button' : undefined}
            onClick={handleOnClick}
            className={cx(
                'bg-card rounded-lg p-2 border text-card-foreground shadow-sm',
                (href || onClick) && 'cursor-default hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none',
                variant === 'secondary' && 'bg-card/60',
                className
            )}
            {...restProps} />
    );
});
Card.displayName = 'Card';
export { Card };

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('flex flex-col space-y-1.5 p-2 pt-1', className)} {...props} />;
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <div id={typeof children === 'string' ? slug(children) : undefined} className={cx('text-2xl font-semibold tracking-tight', className)} {...props}>
            {children}
        </div>
    );
}

export function CardOverflow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('-m-2', className)} {...props}>{props.children}</div>;
}

export type CardContentProps = HTMLAttributes<HTMLDivElement> & { noHeader?: boolean };

export function CardContent({ className, noHeader, ...props }: CardContentProps) {
    return <div className={cx('p-2', !noHeader && 'pt-0', className)} {...props}>{props.children}</div>;
}

export function CardCover({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={className}>{props.children}</div>;
}

export function CardActions({ children, className, ...rest }: RowProps) {
    return (
        <Stack spacing={2} className="-mx-4">
            <Divider />
            <Row className={cx('px-4 pb-0', className)} {...rest}>
                {children}
            </Row>
        </Stack>
    );
}
