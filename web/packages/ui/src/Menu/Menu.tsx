import { ChildrenProps } from "../sharedTypes";
import { Menu as JoyMenu } from '@mui/joy';
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";
import { ReactElement, useId } from "react";

export type ControlAriaProps = {
    'aria-controls'?: string;
    'aria-describedby'?: string;
    'aria-haspopup'?: true;
};

export interface MenuProps extends ChildrenProps {
    menuId?: string;
    renderTrigger: (props: ControlAriaProps & {
        onClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
        onTouchStart: (event: React.TouchEvent<Element>) => void;
    }) => ReactElement,
}

/** @alpha */
export default function Menu({ children, menuId, renderTrigger }: MenuProps) {
    const id = useId();
    const popupState = usePopupState({ variant: 'popover', popupId: menuId ?? id });
    const { anchorReference, anchorPosition, ...menuProps } = bindMenu(popupState);
    const trigger = renderTrigger(bindTrigger(popupState));
    return (
        <div>
            {trigger}
            <JoyMenu {...menuProps}>
                {children}
            </JoyMenu>
        </div>
    );
}
