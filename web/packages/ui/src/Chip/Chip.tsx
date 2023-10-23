import type { PropsWithChildren, MouseEventHandler, ReactNode } from 'react';
import { cx } from 'classix';
import type { ColorPaletteProp } from '../theme';
import {Row} from '../Row';
import {Link} from '../Link';

export type ChipProps = PropsWithChildren<{
    color?: ColorPaletteProp;
    variant?: 'plain' | 'outlined' | 'soft' | 'solid';
    size?: 'sm' | 'md' | 'lg';
    onClick?: MouseEventHandler<HTMLButtonElement>,
    href?: string | undefined,
    startDecorator?: ReactNode,
    className?: string,
}>;

export function Chip({ size, color, startDecorator, onClick, children, href, className }: ChipProps) {
    const actionable = typeof onClick !== 'undefined' || typeof href !== 'undefined';

    const chipClassName = cx(
        'uitw-m-0 uitw-border',
        size === 'sm' && 'uitw-rounded-xl uitw-py-0.5 uitw-px-1.5 uitw-text-xs',
        (!size || size === 'md') && 'uitw-text-sm uitw-py-1 uitw-rounded-2xl uitw-px-3 uitw-px-2',
        size === 'lg' && 'uitw-rounded-3xl uitw-px-3 uitw-text-base uitw-py-1',
        (!color || color === 'neutral') && 'uitw-bg-card uitw-border-foreground/60 uitw-text-foreground/70',
        (!color || color === 'neutral') && actionable && 'hover:uitw-bg-card-foreground/20',
        color === 'info' && 'uitw-bg-sky-300 uitw-text-sky-800 uitw-border-sky-400',
        color === 'warning' && 'uitw-bg-amber-300 uitw-text-amber-800 uitw-border-amber-300 uitw-border-amber-400',
        color === 'success' && 'uitw-bg-lime-300 uitw-text-lime-800 uitw-border-lime-400',
        color === 'error' && 'uitw-bg-red-300 uitw-text-red-800 uitw-border-red-400',
        color === 'primary' && 'uitw-bg-neutral-950 uitw-text-white uitw-border-neutral-950',
        color === 'secondary' && 'uitw-bg-neutral-500 uitw-text-white uitw-border-neutral-600',
        actionable && 'hover:uitw-bg-opacity-90',
    );
    const Wrapper = onClick
        ? (props: PropsWithChildren) => <button onClick={onClick} className={cx(chipClassName, className)}>{props.children}</button>
        : (href
            ? (props: PropsWithChildren) => <Link href={href} className={cx(chipClassName, className)}>{props.children}</Link>
            : (props: PropsWithChildren) => <div className={cx(chipClassName, className)}>{props.children}</div>);

    return (
        <Wrapper>
            <Row spacing={1}>
                {typeof startDecorator !== 'undefined' && startDecorator}
                {children}
            </Row>
        </Wrapper>
    );
}
