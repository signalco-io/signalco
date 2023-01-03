import { type MouseEventHandler, type ReactNode } from 'react';
import Link from '../Link';
import Row from '../Row';
import { type ChildrenProps } from '../sharedTypes';
import styles from './Chip.module.scss';
import { cx } from 'classix';

/** @alpha */
export type ChipProps = ChildrenProps & {
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    variant?: "plain" | "outlined" | "soft" | "solid";
    size?: 'sm' | 'md' | 'lg';
    onClick?: MouseEventHandler<HTMLButtonElement>,
    href?: string | undefined,
    startDecorator?: ReactNode,
}

/** @alpha */
export default function Chip({ size, color, startDecorator, onClick, children, href }: ChipProps) {
    const className = cx(
        styles.root, 
        size && styles[size],
        color && styles[color]);
    const Wrapper = onClick
        ? (props: ChildrenProps) => <button onClick={onClick} className={className}>{props.children}</button>
        : (href
            ? (props: ChildrenProps) => <Link href={href} className={className}>{props.children}</Link>
            : (props: ChildrenProps) => <div className={className}>{props.children}</div>);

    return (
        <Wrapper>
            <Row spacing={1}>
                {typeof startDecorator !== 'undefined' && startDecorator}
                {children}
            </Row>
        </Wrapper>
    );
}
