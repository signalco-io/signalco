import { MouseEventHandler, ReactNode } from 'react';
import JoiChip from '@mui/joy/Chip';
import { ColorPaletteProp, VariantProp } from '@mui/joy';
import { ChildrenProps } from 'src/sharedTypes';

export interface ChipProps extends ChildrenProps {
    color?: ColorPaletteProp
    size?: 'sm' | 'md' | 'lg'
    onClick?: MouseEventHandler<HTMLButtonElement>
    startDecorator?: ReactNode,
    variant?: VariantProp
}

export default function Chip(props: ChipProps) {
    const { color, size, startDecorator, variant, onClick, children } = props;
    return <JoiChip variant={variant} color={color} size={size} startDecorator={startDecorator} onClick={onClick}>{children}</JoiChip>
}
