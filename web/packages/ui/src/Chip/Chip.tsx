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
}>;

export function Chip({ size, color, startDecorator, onClick, children, href }: ChipProps) {
    const className = cx(
        'm-0 border',
        size === 'sm' && 'rounded-xl py-0.5 px-1.5 text-xs',
        (!size || size === 'md') && 'text-sm py-1 rounded-2xl px-3 px-2',
        size === 'lg' && 'rounded-3xl px-3 text-base py-1',
        (!color || color === 'neutral') && 'border-neutral-400 text-neutral-700',
        color === 'info' && 'bg-sky-300 text-sky-800 border-sky-400',
        color === 'warning' && 'bg-amber-300 text-amber-800 border-amber-300 border-amber-400',
        color === 'success' && 'bg-lime-300 text-lime-800 border-lime-400',
        color === 'error' && 'bg-red-300 text-red-800 border-red-400',
        color === 'primary' && 'bg-neutral-950 text-white border-neutral-950',
        color === 'secondary' && 'bg-neutral-500 text-white border-neutral-600',
    );
    const Wrapper = onClick
        ? (props: PropsWithChildren) => <button onClick={onClick} className={className}>{props.children}</button>
        : (href
            ? (props: PropsWithChildren) => <Link href={href} className={className}>{props.children}</Link>
            : (props: PropsWithChildren) => <div className={className}>{props.children}</div>);

    return (
        <Wrapper>
            <Row spacing={1}>
                {typeof startDecorator !== 'undefined' && startDecorator}
                {children}
            </Row>
        </Wrapper>
    );
}
