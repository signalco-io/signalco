import { jsx, jsxs, Fragment as Fragment$1 } from 'react/jsx-runtime';
import { Card, IconButton, Breadcrumbs as Breadcrumbs$1, Typography, Button, Alert, CircularProgress, Menu as Menu$1, ListItemDecorator } from '@mui/joy';
export { Alert, AspectRatio, Avatar, Badge, Button, Card, CardOverflow, CircularProgress, CssBaseline, Divider, FormControl, FormLabel, Grid, IconButton, Input, Checkbox as JoyCheckbox, Link as JoyLink, List, ListDivider, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Modal, ModalClose, ModalDialog, Option, Radio, RadioGroup, Select, Sheet, Slider, Switch, TextField, Tooltip, Typography, selectClasses } from '@mui/joy';
import { useState, Fragment, useId, useMemo } from 'react';
import Link$1 from 'next/link';
import { Disabled, Check, Copy, Warning, Navigate } from '@signalco/ui-icons';
import { bindPopover, usePopupState, bindMenu, bindTrigger } from 'material-ui-popup-state/hooks';
import { ClickAwayListener, PopperUnstyled } from '@mui/base';
import Image from 'next/image';
import JoyMenuItem from '@mui/joy/MenuItem';
export { Box } from '@mui/system';
export { CssVarsProvider, extendTheme, getInitColorSchemeScript, useColorScheme } from '@mui/joy/styles';

/** @alpha */
function Icon(props) {
    return (jsx("span", { className: "material-icons", style: {
            ...props.sx
        }, children: props.children }));
}

/** @alpha */
function Row({ children, spacing, alignItems, justifyContent }) {
    return (jsx("div", { style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: alignItems ?? 'center',
            justifyContent,
            gap: `${(spacing ?? 0) * 8}px`
        }, children: children }));
}

/** @alpha */
function Accordion(props) {
    const { children, open, sx, disabled, onChange, unmountOnExit } = props;
    const [isOpen, setIsOpen] = useState(open ?? false);
    const handleOpen = (e) => {
        if (typeof open !== 'undefined' && typeof onChange !== 'undefined') {
            onChange(e, !open);
        }
        else if (typeof open === 'undefined') {
            setIsOpen(!isOpen);
        }
    };
    const actualOpen = open ?? isOpen;
    return (jsxs(Card, { variant: "soft", sx: sx, children: [jsxs(Row, { spacing: 1, justifyContent: "space-between", children: [!!children && Array.isArray(children) ? children[0] : children, !disabled && (jsx(IconButton, { size: "sm", onClick: handleOpen, children: jsx(Icon, { children: actualOpen ? 'expand_less' : 'expand_more' }) }))] }), (!unmountOnExit || actualOpen) && (jsx("div", { style: { height: actualOpen ? 'auto' : 0, overflow: 'hidden' }, children: !!children && Array.isArray(children) && children.filter((_, i) => i !== 0) }))] }));
}

/** @alpha */
function Link({ children, href }) {
    return (jsx(Link$1, { href: href, passHref: true, prefetch: false, style: { textDecoration: 'none', color: 'var(--joy-palette-text-secondary)' }, children: children }));
}

/** @alpha */
function Breadcrumbs(props) {
    const { items } = props;
    return (jsx(Breadcrumbs$1, { separator: '\u203a', size: "lg", children: items.map((i, index) => jsx(Fragment, { children: i.href
                ? jsx(Link, { href: i.href, children: i.label })
                : jsx(Typography, { children: i.label }) }, i.href ?? index)) }));
}

var styles = {"root":"Chip-module_root__l5QgN"};

/** @alpha */
function Chip(props) {
    const { color, size, startDecorator, variant, onClick, children } = props;
    return (jsx("button", { disabled: !onClick, onClick: onClick, className: styles.root, children: jsxs(Row, { spacing: 1, children: [startDecorator && startDecorator, children] }) }));
}

/** @alpha */
function Container({ maxWidth, children }) {
    let width = 1200;
    switch (maxWidth) {
        case 'md':
            width = 900;
            break;
        case 'sm':
            width = 600;
        case 'xs':
            width = 444;
        case 'xl':
            width = 1536;
        case false:
            width = undefined;
    }
    return (jsx("div", { style: {
            width: '100%',
            display: 'block',
            maxWidth: width ? `${width}px` : undefined,
            margin: 'auto'
        }, children: children }));
}

/** @alpha */
function DotIndicator(props) {
    const { color, content, size: requestedSize } = props;
    const size = requestedSize || 10;
    return (jsx("div", { style: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: `var(--joy-palette-${color}-400)`,
            color: 'white',
            textAlign: 'center'
        }, children: content }));
}

/** @alpha */
function DisableButton(props) {
    const { disabled, readonly, onClick } = props;
    return (jsx(Button, { disabled: readonly, color: disabled ? 'warning' : 'success', variant: disabled ? 'solid' : 'soft', size: "sm", startDecorator: disabled ? jsx(Disabled, {}) : jsx(Check, {}), onClick: onClick, children: disabled ? 'Disabled' : 'Enabled' }));
}

/** @alpha */
function Popper(props) {
    const { popupState, children } = props;
    const { anchorReference, anchorPosition, ...popoverProps } = bindPopover(popupState);
    return (jsx(ClickAwayListener, { onClickAway: (e) => {
            if (e.target !== popupState.anchorEl) {
                popupState.close();
            }
        }, children: jsx(PopperUnstyled, { style: { zIndex: 999999 }, ...popoverProps, children: children }) }));
}

/** @alpha */
function IconButtonCopyToClipboard(props) {
    const id = useId();
    const popupState = usePopupState({ variant: 'popper', popupId: `copytoclipboard-button-${id}` });
    const [error, setError] = useState(false);
    const handleClickShowCopyToClipboard = (event) => {
        try {
            const value = props.value || props.defaultValue;
            if (typeof value === 'string') {
                navigator.clipboard.writeText(value);
                setError(false);
            }
            else {
                setError(true);
            }
        }
        catch (error) {
            console.warn('Failed to copy to clipboard', error);
            setError(true);
        }
        finally {
            if (event.target) {
                popupState.open(event.currentTarget);
                setTimeout(() => popupState.close(), 2000);
            }
        }
    };
    const handleMouseDownCopyToClipboard = (event) => {
        event.preventDefault();
    };
    return (jsxs(Fragment$1, { children: [jsx(IconButton, { size: "md", className: props.className, title: props.title, variant: "plain", "aria-label": props.title, onClick: handleClickShowCopyToClipboard, onMouseDown: handleMouseDownCopyToClipboard, children: props.children ? props.children : jsx(Copy, {}) }), jsx(Popper, { popupState: popupState, children: jsx(Alert, { color: error ? 'warning' : 'neutral', startDecorator: error && jsx(Warning, {}), children: error ? props.errorMessage : props.successMessage }) })] }));
}

/** @alpha */
function ImageLink({ href, imageProps }) {
    return (jsx(Link, { href: href, children: jsx(Image, { ...imageProps, alt: imageProps.alt }) }));
}

/** @alpha */
function Loadable(props) {
    const { isLoading, placeholder, error, children, contentVisible } = props;
    const indicator = useMemo(() => {
        switch (placeholder) {
            case 'skeletonText':
            // return <Skeleton variant="text" width={width ?? 120} />;
            case 'skeletonRect':
            // return <Skeleton variant="rectangular" width={width ?? 120} height={height ?? 32} />;
            case 'circular':
            default:
                return jsx("div", { style: { textAlign: 'center' }, children: jsx(CircularProgress, {}) });
        }
    }, [placeholder]);
    if (error) {
        console.warn('User presented with error', error, typeof error);
        let errorDisplay = error;
        if (typeof error === 'object') {
            const errorAny = error;
            if (typeof errorAny.message !== 'undefined') {
                errorDisplay = errorAny.message;
            }
            else {
                errorDisplay = JSON.stringify(error);
            }
        }
        return (jsx(Alert, { variant: "soft", color: "danger", sx: { width: '100%' }, startDecorator: jsx(Warning, {}), children: errorDisplay }));
    }
    return (jsxs(Fragment$1, { children: [(contentVisible || isLoading) && (jsx("div", { style: { visibility: isLoading ? 'visible' : 'hidden' }, children: indicator })), (contentVisible || !isLoading) && children] }));
}

/** @alpha */
function NavigatingButton({ href, size, disabled, hideArrow, children }) {
    return (jsx(Link$1, { href: href, passHref: true, prefetch: false, children: jsx(Button, { color: "primary", variant: hideArrow ? 'plain' : 'solid', disabled: disabled, size: size, endDecorator: jsx(Navigate, { size: 16 }), sx: {
                '.JoyButton-endDecorator': {
                    opacity: hideArrow ? 0 : 1,
                    transition: 'opacity 0.2s linear'
                },
                '&:hover': {
                    '.JoyButton-endDecorator': {
                        opacity: 1
                    }
                }
            }, children: children }) }));
}

/** @alpha */
function NoDataPlaceholder({ content }) {
    return jsx(Typography, { level: "body2", children: content });
}

/** @alpha */
function Menu({ children, menuId, renderTrigger }) {
    const popupState = usePopupState({ variant: 'popover', popupId: menuId });
    const { anchorReference, anchorPosition, ...menuProps } = bindMenu(popupState);
    const trigger = useMemo(() => renderTrigger(bindTrigger(popupState)), [renderTrigger]);
    return (jsxs("div", { children: [trigger, jsx(Menu$1, { ...menuProps, children: children })] }));
}

/** @alpha */
function MenuItem({ startDecorator, children, ...rest }) {
    return (jsxs(JoyMenuItem, { ...rest, children: [startDecorator && (jsx(ListItemDecorator, { children: startDecorator })), children] }));
}

/** @alpha */
function MenuItemLink({ href, ...rest }) {
    return (jsx(Link$1, { href: href, passHref: true, children: jsx(MenuItem, { ...rest }) }));
}

/** @alpha */
function Stack({ children, spacing, alignItems }) {
    return (jsx("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems,
            gap: `${(spacing ?? 0) * 8}px`
        }, children: children }));
}

export { Accordion, Breadcrumbs, Chip, Container, DisableButton, DotIndicator, Icon, IconButtonCopyToClipboard, ImageLink, Link, Loadable, Menu, MenuItem, MenuItemLink, NavigatingButton, NoDataPlaceholder, Popper, Row, Stack };
//# sourceMappingURL=index.js.map
