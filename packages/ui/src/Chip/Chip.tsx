import { type MouseEventHandler, type ReactNode } from 'react';
import { Chip as JoiChip } from '@mui/joy';
import { type ChildrenProps } from '../sharedTypes';

export type ChipProps = ChildrenProps & {
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning";
    size?: 'sm' | 'md' | 'lg';
    onClick?: MouseEventHandler<HTMLButtonElement>
    startDecorator?: ReactNode,
    variant?: "plain" | "outlined" | "soft" | "solid";
}

export default function Chip(props: ChipProps) {
    const { color, size, startDecorator, variant, onClick, children } = props;
    return (
        <JoiChip
            variant={variant}
            color={color}
            size={size}
            startDecorator={startDecorator}
            onClick={onClick}>
            {children}
        </JoiChip>
    );
}
