import { type MouseEventHandler, type ReactNode } from 'react';
import Link from '../Link';
import Row from '../Row';
import { type ChildrenProps } from '../sharedTypes';
import styles from './Chip.module.scss';

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
export default function Chip({ startDecorator, onClick, children, href }: ChipProps) {
    const Wrapper = onClick
        ? (props: ChildrenProps) => <button onClick={onClick} className={styles.root}>{props.children}</button>
        : (href
            ? (props: ChildrenProps) => <Link href={href} className={styles.root}>{props.children}</Link>
            : (props: ChildrenProps) => <div className={styles.root}>{props.children}</div>);

    return (
        <Wrapper>
            <Row spacing={1}>
                {typeof startDecorator !== 'undefined' && startDecorator}
                {children}
            </Row>
        </Wrapper>
    );
}
