import { type MouseEventHandler, type ReactNode } from 'react';
import Row from '../Row';
import { type ChildrenProps } from '../sharedTypes';
import styles from './Chip.module.scss';

/** @alpha */
export type ChipProps = ChildrenProps & {
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    size?: 'sm' | 'md' | 'lg';
    onClick?: MouseEventHandler<HTMLButtonElement>
    startDecorator?: ReactNode,
    variant?: "plain" | "outlined" | "soft" | "solid";
}

/** @alpha */
export default function Chip(props: ChipProps) {
    const { color, size, startDecorator, variant, onClick, children } = props;
    return (
        <button
            onClick={onClick}
            className={styles.root}>
            <Row spacing={1}>
                {startDecorator && startDecorator}
                {children}
            </Row>
        </button>
        // <JoiChip
        //     variant={variant}
        //     color={color}
        //     size={size}
        //     startDecorator={startDecorator}
        //     onClick={onClick}>
        //     {children}
        // </JoiChip>
    );
}
