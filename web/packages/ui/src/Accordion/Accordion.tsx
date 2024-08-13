import { isValidElement, useState } from 'react';
import type { ComponentProps, MouseEvent } from 'react';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';
import { Collapse } from '@signalco/ui-primitives/Collapse';
import { Card, CardContent, CardHeader } from '@signalco/ui-primitives/Card';
import { ExpandDown } from '@signalco/ui-icons';

export type AccordionProps = ComponentProps<typeof Card> & {
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    onOpenChanged?: (event: MouseEvent<HTMLButtonElement>, open: boolean) => void;
    unmountOnExit?: boolean;
    variant?: 'soft' | 'plain';
};

export function Accordion({ children, defaultOpen, open, disabled, onOpenChanged, unmountOnExit, variant, className, ...props }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(open ?? (defaultOpen ?? false));

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
        <Card className={cx(variant === 'plain' && 'bg-transparent shadow-none border-none p-0', className)} {...props}>
            <CardHeader className={cx(variant==='soft' ? 'p-2' : 'px-0 py-2')}>
                <button className="text-left" onClick={handleOpen}>
                    <Row spacing={1} justifyContent="space-between">
                        {multipleChildren && isValidElement(firstChild) ? firstChild : children}
                        {!disabled && (
                            <ExpandDown className={cx('transition-transform', actualOpen && 'scale-y-[-1]')} />
                        )}
                    </Row>
                </button>
            </CardHeader>
            {(!unmountOnExit || actualOpen) && (
                <Collapse appear={actualOpen}>
                    {multipleChildren && (
                        <CardContent className={cx(variant==='soft' ? 'p-2' : 'px-0 py-2')}>
                            {otherChildren?.map((child) => isValidElement(child) ? child : null)}
                        </CardContent>
                    )}
                </Collapse>
            )}
        </Card>
    )
}
