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
        <Card className={cx('p-0', variant === 'plain' && 'bg-transparent shadow-none border-none', className)} {...props}>
            <CardHeader className="p-0">
                <button className={cx('text-left', variant === 'plain' ? 'px-2 py-4' : 'p-4')} onClick={handleOpen}>
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
                        <CardContent className={cx(variant === 'plain' ? 'px-2 pt-2 pb-4' : 'p-4 pt-2')}>
                            {otherChildren?.map((child) => isValidElement(child) ? child : null)}
                        </CardContent>
                    )}
                </Collapse>
            )}
        </Card>
    )
}
