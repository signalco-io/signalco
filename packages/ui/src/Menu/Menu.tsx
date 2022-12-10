import { ChildrenProps } from "../sharedTypes";
import { Menu as JoyMenu } from '@mui/joy';
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";
import { ReactElement, useMemo } from "react";

export interface MenuProps extends ChildrenProps {
    menuId: string;
    renderTrigger: (props: any) => ReactElement
}

export default function Menu({ children, menuId, renderTrigger }: MenuProps) {
    const popupState = usePopupState({ variant: 'popover', popupId: menuId });
    const { anchorReference, anchorPosition, ...menuProps } = bindMenu(popupState);
    const trigger = useMemo(() => renderTrigger(bindTrigger(popupState)), [renderTrigger]);
    return (
        <div>
            {trigger}
            <JoyMenu {...menuProps}>
                {children}
            </JoyMenu>
        </div>
    );
}
