import { Card, IconButton } from '@mui/joy';
import { type SxProps } from '@mui/system';
import { type MouseEvent, useState } from 'react';
import Icon from '../Icon';
import Row from '../Row';
import { ChildrenProps } from '../sharedTypes';

/** @alpha */
export interface AccordionProps extends ChildrenProps {
    open?: boolean;
    disabled?: boolean;
    sx?: SxProps;
    onChange?: (e: MouseEvent<HTMLAnchorElement>, expanded: boolean) => void,
    unmountOnExit?: boolean;
}

/** @alpha */
export default function Accordion(props: AccordionProps) {
    const { children, open, sx, disabled, onChange, unmountOnExit } = props;
    const [isOpen, setIsOpen] = useState(open ?? false);

    const handleOpen = (e: MouseEvent<HTMLAnchorElement>) => {
        if (typeof open !== 'undefined' && typeof onChange !== 'undefined') {
            onChange(e, !open);
        } else if (typeof open === 'undefined') {
            setIsOpen(!isOpen);
        }
    };

    const actualOpen = open ?? isOpen;

    return (
        <Card variant="soft" sx={sx}>
            <Row spacing={1} justifyContent="space-between">
                {!!children && Array.isArray(children) ? children[0] : children}
                {!disabled && (
                    <IconButton size="sm" onClick={handleOpen}>
                        <Icon>{actualOpen ? 'expand_less' : 'expand_more'}</Icon>
                    </IconButton>
                )}
            </Row>
            {(!unmountOnExit || actualOpen) && (
                <div style={{ height: actualOpen ? 'auto' : 0, overflow: 'hidden' }}>
                    {!!children && Array.isArray(children) && children.filter((_, i) => i !== 0)}
                </div>
            )}
        </Card>
    )
}
