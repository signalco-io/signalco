import { ChildrenProps } from "../sharedTypes";
import { Menu as JoyMenu } from '@mui/joy';
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";
import { ReactElement, useMemo } from "react";

/** @alpha */
export interface MenuProps extends ChildrenProps {
    menuId: string;
    renderTrigger: (props: any) => ReactElement,
}

/** @alpha */
export default function Menu({ children, menuId, renderTrigger }: MenuProps) {
    const popupState = usePopupState({ variant: 'popover', popupId: menuId });
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
