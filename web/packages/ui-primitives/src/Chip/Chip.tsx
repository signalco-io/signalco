import type { PropsWithChildren, MouseEventHandler, ReactNode } from 'react';
import type { ColorPaletteProp } from '../theme';
import {Row} from '../Row';
import {Link} from '../Link';
import { cx } from '../cx';

export type ChipProps = PropsWithChildren<{
    disabled?: boolean;
    color?: ColorPaletteProp;
    variant?: 'plain' | 'outlined' | 'soft' | 'solid';
    size?: 'sm' | 'md' | 'lg';
    onClick?: MouseEventHandler<HTMLButtonElement>,
    href?: string | undefined,
    startDecorator?: ReactNode,
    className?: string,
    title?: string,
}>;

export function Chip({ disabled, size, color, startDecorator, onClick, children, href, className, title }: ChipProps) {
    const actionable = typeof onClick !== 'undefined' || typeof href !== 'undefined';

    const chipClassName = cx(
        'm-0 border',
        size === 'sm' && 'rounded-xl py-0.5 px-1.5 text-xs',
        (!size || size === 'md') && 'text-sm py-1 rounded-2xl px-2',
        size === 'lg' && 'rounded-3xl px-3 text-base py-1',
        (!color || color === 'neutral') && 'bg-card text-foreground/60',
        (!color || color === 'neutral') && actionable && 'hover:bg-card-foreground/20',
        color === 'info' && 'bg-sky-300 text-sky-800 border-sky-400',
        color === 'warning' && 'bg-amber-300 text-amber-800 border-amber-400',
        color === 'success' && 'bg-lime-300 text-lime-800 border-lime-400',
        color === 'error' && 'bg-red-200 dark:bg-red-300 dark:text-red-900 text-red-800 border-red-300 dark:border-red-400',
        color === 'primary' && 'bg-neutral-950 text-white border-neutral-950',
        color === 'secondary' && 'bg-neutral-500 text-white border-neutral-600',
        (actionable && !disabled) && 'hover:bg-opacity-90',
    );
    const Wrapper = onClick
        ? (props: PropsWithChildren) => <button title={title} onClick={onClick} className={cx(chipClassName, className)}>{props.children}</button>
        : (href
            ? (props: PropsWithChildren) => <Link title={title} href={href} className={cx(chipClassName, className)}>{props.children}</Link>
            : (props: PropsWithChildren) => <div title={title} className={cx(chipClassName, className)}>{props.children}</div>);

    return (
        <Wrapper>
            <Row spacing={1}>
                {typeof startDecorator !== 'undefined' && startDecorator}
                {children}
            </Row>
        </Wrapper>
    );
}
