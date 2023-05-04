import type { PropsWithChildren, MouseEventHandler, ReactNode } from 'react';
import {Link} from '../Link';
import {Row} from '../Row';
import { cx } from 'classix';

export type ChipProps = PropsWithChildren<{
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    variant?: "plain" | "outlined" | "soft" | "solid";
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
        size && (size === 'sm' ? smStyles : lgStyles),
        // color && styles[color]
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
