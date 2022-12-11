import { type MouseEventHandler, type ReactNode } from 'react';
import Row from '../Row';
import { type ChildrenProps } from '../sharedTypes';
import styles from './Chip.module.scss';

/** @alpha */
export type ChipProps = ChildrenProps & {
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    variant?: "plain" | "outlined" | "soft" | "solid";
    size?: 'sm' | 'md' | 'lg';
    onClick?: MouseEventHandler<HTMLButtonElement>
    startDecorator?: ReactNode,
}

/** @alpha */
export default function Chip(props: ChipProps) {
    const { startDecorator, onClick, children } = props;
    return (
        <button
            disabled={!onClick}
            onClick={onClick}
            className={styles.root}>
            <Row spacing={1}>
                {startDecorator && startDecorator}
                {children}
            </Row>
        </button>
    );
}
