import { useState } from 'react';
import type { ComponentProps, MouseEvent } from 'react';
import { cx } from 'classix';
import { Row } from '../Row';
import { Icon } from '../Icon';
import { Collapse } from '../Collapse';
import { Card, CardContent, CardHeader } from '../Card';

export type AccordionProps = ComponentProps<typeof Card> & {
    open?: boolean;
    disabled?: boolean;
    onOpenChanged?: (event: MouseEvent<HTMLButtonElement>, open: boolean) => void;
    unmountOnExit?: boolean;
};

export function Accordion({ children, open, disabled, onOpenChanged, unmountOnExit, className, ...props }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(open ?? false);

    const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
        if (typeof open !== 'undefined' && typeof onOpenChanged !== 'undefined') {
            onOpenChanged(event, !open);
        } else if (typeof open === 'undefined') {
            setIsOpen(!isOpen);
        }
    };

    const actualOpen = open ?? isOpen;

    const multipleChildren = !!children && Array.isArray(children);

    return (
        <Card className={cx('', className)} onClick={handleOpen} {...props}>
            <CardHeader className="uitw-p-2">
                <Row spacing={1} justifyContent="space-between">
                    {multipleChildren ? children[0] : children}
                    {!disabled && (
                        <Icon>{actualOpen ? 'expand_less' : 'expand_more'}</Icon>
                    )}
                </Row>
            </CardHeader>
            {(!unmountOnExit || actualOpen) && (
                <Collapse appear={actualOpen}>
                    {multipleChildren && (
                        <CardContent className="uitw-p-2">
                            {children.filter((_, i) => i !== 0)}
                        </CardContent>
                    )}
                </Collapse>
            )}
        </Card>
    )
}
