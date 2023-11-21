import { isValidElement, useState } from 'react';
import type { ComponentProps, MouseEvent } from 'react';
import { cx } from '@signalco/ui/cx';
import { ExpandDown } from '@signalco/ui-icons';
import { Row } from '../Row';
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

    const firstChild = Array.isArray(children) ? children[0] : children;
    const otherChildren = Array.isArray(children) ? children.filter((_: unknown, i: number) => i !== 0 && isValidElement) : [];
    const multipleChildren = otherChildren.length > 0;

    return (
        <Card className={cx('', className)} onClick={handleOpen} {...props}>
            <CardHeader className="p-2">
                <Row spacing={1} justifyContent="space-between">
                    {multipleChildren && isValidElement(firstChild) ? firstChild : children}
                    {!disabled && (
                        <ExpandDown className={cx('transition-transform', actualOpen && 'scale-y-[-1]')} />
                    )}
                </Row>
            </CardHeader>
            {(!unmountOnExit || actualOpen) && (
                <Collapse appear={actualOpen}>
                    {multipleChildren && isValidElement(otherChildren) && (
                        <CardContent className="p-2">
                            {otherChildren}
                        </CardContent>
                    )}
                </Collapse>
            )}
        </Card>
    )
}
