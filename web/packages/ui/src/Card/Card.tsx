import { type HTMLAttributes, type PropsWithChildren, type MouseEventHandler, forwardRef } from 'react';
import { cx } from 'classix';
import { Link } from '../Link';

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
        <button className="uitw-text-left" onClick={onClick}>{children}</button>
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
                    'uitw-bg-card uitw-rounded-lg uitw-p-2 uitw-border uitw-text-card-foreground uitw-shadow-sm',
                    (href || onClick) && 'hover:uitw-bg-accent hover:uitw-text-accent-foreground disabled:uitw-opacity-50 disabled:uitw-pointer-events-none',
                    className
                )}
                {...restProps} />
        </CardWrapper>
    );
});
CardForwarded.displayName = 'Card';
export const Card = CardForwarded;

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('uitw-flex uitw-flex-col uitw-space-y-1.5 uitw-p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <div className={cx('uitw-text-lg uitw-font-semibold uitw-leading-none uitw-tracking-tight', className)} {...props} />;
}

export function CardOverflow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('-uitw-m-2', className)} {...props}>{props.children}</div>;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx('uitw-p-6 uitw-pt-0', className)} {...props}>{props.children}</div>;
}

export function CardCover({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={className}>{props.children}</div>;
}
