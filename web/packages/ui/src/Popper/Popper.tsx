import { bindPopover, PopupState } from 'material-ui-popup-state/hooks';
import { Popper as PopperUnstyled, ClickAwayListener } from "@mui/base";
import type { PropsWithChildren } from 'react';

export type PopperProps = PropsWithChildren<{
    popupState: PopupState;
}>;

export function Popper(props: PopperProps) {
    const { popupState, children } = props;
    const { anchorReference, anchorPosition, ...popoverProps } = bindPopover(popupState);

    return (
        <ClickAwayListener onClickAway={(e) => {
            if (e.target !== popupState.anchorEl) {
                popupState.close();
            }
        }}>
            <PopperUnstyled style={{ zIndex: 999999 }} {...popoverProps}>
                {children}
            </PopperUnstyled>
        </ClickAwayListener>
    );
}
