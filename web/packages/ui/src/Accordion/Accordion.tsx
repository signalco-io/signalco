import { useState } from 'react';
import type { ComponentProps, MouseEvent } from 'react';
import { cx } from 'classix';
import { Row } from '../Row';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';
import { Collapse } from '../Collapse';
import { Card } from '../Card';

export type AccordionProps = ComponentProps<typeof Card> & {
    open?: boolean;
    disabled?: boolean;
    onOpenChanged?: (e: MouseEvent<HTMLButtonElement>, open: boolean) => void;
    unmountOnExit?: boolean;
};

export function Accordion({ children, open, disabled, onOpenChanged, unmountOnExit, className, ...props }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(open ?? false);

    const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
        if (typeof open !== 'undefined' && typeof onOpenChanged !== 'undefined') {
            onOpenChanged(e, !open);
        } else if (typeof open === 'undefined') {
            setIsOpen(!isOpen);
        }
    };

    const actualOpen = open ?? isOpen;

    const multipleChildren = !!children && Array.isArray(children);

    return (
        <Card className={cx('py-2 px-4', className)} {...props}>
            <Row spacing={1} justifyContent="space-between">
                {multipleChildren ? children[0] : children}
                {!disabled && (
                    <IconButton variant="plain" size="sm" onClick={handleOpen}>
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
