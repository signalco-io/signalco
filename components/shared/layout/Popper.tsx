import { bindPopover, PopupState } from 'material-ui-popup-state/hooks';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { PopperUnstyled } from '@mui/base';
import { ChildrenProps } from 'src/sharedTypes';

export interface PopperProps extends ChildrenProps {
    popupState: PopupState;
}

export default function Popper(props: PopperProps) {
    const { popupState, children } = props;

    const { anchorReference, ...popoverProps } = bindPopover(popupState);

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
