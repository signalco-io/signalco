import { MouseEvent, ReactElement, TouchEvent } from 'react'
import { ChildrenProps } from "../sharedTypes";
import JoyMenuItem from '@mui/joy/MenuItem';
import { ListItemDecorator } from '@mui/joy';

export type MenuItemProps = ChildrenProps & {
    'aria-controls'?: string
    'aria-describedby'?: string
    'aria-haspopup'?: true
    onClick?: (event: MouseEvent<any>) => void
    onTouchStart?: (event: TouchEvent<any>) => void,
    startDecorator?: ReactElement,
    href?: string;
}

export function MenuItem({ startDecorator, children, ...rest }: MenuItemProps) {
    return (
        <JoyMenuItem {...rest}>
            {startDecorator && (
                <ListItemDecorator>
                    {startDecorator}
                </ListItemDecorator>
            )}
            {children}
        </JoyMenuItem>
    );
}
