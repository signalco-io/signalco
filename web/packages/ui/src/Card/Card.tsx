import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cx } from 'classix';
import { Link } from '../Link';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    href?: string;
};

export function Card({ href, className, ...restProps }: CardProps) {
    const Comp = href
        ? ({ children }: PropsWithChildren) => <Link href={href}>{children}</Link>
        : ({ children }: PropsWithChildren) => (<>{children}</>);

    return (
        <Comp>
            <div
                className={cx(
                    'bg-card rounded-lg p-2 border text-card-foreground shadow-sm',
                    className
                )}
                {...restProps} />
        </Comp>
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <div className={cx('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function CardOverflow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={className}>{props.children}</div>;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('p-6 pt-0', className)}>{props.children}</div>;
}

export function CardCover({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={className}>{props.children}</div>;
}
