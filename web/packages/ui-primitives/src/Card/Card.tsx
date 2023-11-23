import { type HTMLAttributes, type PropsWithChildren, type MouseEventHandler, forwardRef } from 'react';
import { Link } from '../Link';
import { cx } from '../cx';

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
    href?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

function LinkCard({ href, children }: PropsWithChildren & Required<Pick<CardProps, 'href'>>) {
    return (
        <Link href={href}>{children}</Link>
    );
}

function ButtonCard({ onClick, children }: PropsWithChildren & Required<Pick<CardProps, 'onClick'>>) {
    return (
        <button className="text-left" onClick={onClick}>{children}</button>
    );
}

function BareCard({ children }: PropsWithChildren) {
    return (
        <>{children}</>
    );
}

function CardWrapper({ href, onClick, children }: PropsWithChildren & Pick<CardProps, 'href' | 'onClick'>) {
    if (href) return <LinkCard href={href}>{children}</LinkCard>;
    if (onClick) return <ButtonCard onClick={onClick}>{children}</ButtonCard>;
    return <BareCard>{children}</BareCard>;
}

const CardForwarded = forwardRef<HTMLDivElement, CardProps>(({ href, onClick, className, ...restProps }, ref) => {
    return (
        <CardWrapper href={href} onClick={onClick}>
            <div
                ref={ref}
                className={cx(
                    'bg-card rounded-lg p-2 border text-card-foreground shadow-sm',
                    (href || onClick) && 'hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none',
                    className
                )}
                {...restProps} />
        </CardWrapper>
    );
});
CardForwarded.displayName = 'Card';
export const Card = CardForwarded;

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <div className={cx('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function CardOverflow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('-m-2', className)} {...props}>{props.children}</div>;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('p-6 pt-0', className)} {...props}>{props.children}</div>;
}

export function CardCover({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={className}>{props.children}</div>;
}
