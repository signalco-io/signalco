import { IconButton } from '@mui/joy';
import { Card } from "../Card";
import { PropsWithChildren, useState } from 'react';
import type { MouseEvent } from 'react';
import { Collapse } from '../Collapse';
import {Icon} from '../Icon';
import {Row} from '../Row';

export type AccordionProps = PropsWithChildren<{
    open?: boolean;
    disabled?: boolean;
    onChange?: (e: MouseEvent<HTMLAnchorElement>, expanded: boolean) => void,
    unmountOnExit?: boolean;
    className?: string | undefined;
}>;

export function Accordion({ children, open, disabled, onChange, unmountOnExit, className }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(open ?? false);

    const handleOpen = (e: MouseEvent<HTMLAnchorElement>) => {
        if (typeof open !== 'undefined' && typeof onChange !== 'undefined') {
            onChange(e, !open);
        } else if (typeof open === 'undefined') {
            setIsOpen(!isOpen);
        }
    };

    const actualOpen = open ?? isOpen;

    const multipleChildren = !!children && Array.isArray(children);

    return (
        <Card variant="soft" className={className}>
            <Row spacing={1} justifyContent="space-between">
                {multipleChildren ? children[0] : children}
                {!disabled && (
                    <IconButton size="sm" onClick={handleOpen}>
                        <Icon>{actualOpen ? 'expand_less' : 'expand_more'}</Icon>
                    </IconButton>
                )}
            </Row>
            {(!unmountOnExit || actualOpen) && (
                <Collapse appear={actualOpen}>
                    {multipleChildren && children.filter((_, i) => i !== 0)}
                </Collapse>
            )}
        </Card>
    )
}
