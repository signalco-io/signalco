import { MouseEvent, PropsWithChildren, ReactElement, TouchEvent } from 'react'
import JoyMenuItem from '@mui/joy/MenuItem';
import { ListItemDecorator } from '../List';

export type MenuItemProps = PropsWithChildren<{
    'aria-controls'?: string
    'aria-describedby'?: string
    'aria-haspopup'?: true
    onClick?: (event: MouseEvent<any>) => void
    onTouchStart?: (event: TouchEvent<any>) => void,
    startDecorator?: ReactElement,
    href?: string;
}>;

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
