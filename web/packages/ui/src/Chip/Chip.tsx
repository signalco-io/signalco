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

const smStyles = 'rounded-xl py-0.5 px-1 text-xs'; //     padding: 2px 6px; font-size: 0.7rem;
const lgStyles = 'rounded-3xl px-3 text-base'; //     padding: 4px 12px; font-size: 1rem;

export function Chip({ size, color, startDecorator, onClick, children, href }: ChipProps) {
    const className = cx(
        'py-1 px-2 m-0 text-sm border border-neutral-500 rounded-2xl',
        (size && size === 'sm') && smStyles,
        (!size || size === 'lg') && lgStyles,
        // color && styles[color],
        color === 'info' && 'bg-sky-300 text-sky-800 border-sky-300',
        color === 'warning' && 'bg-amber-300 text-amber-800 border-amber-300',
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
