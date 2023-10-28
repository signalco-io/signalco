import { type ReactElement } from 'react';
import { cx } from 'classix';
import { Row } from '../Row';
import { Button } from '../Button';

export type ListItemPropsOptions = {
    href: string | undefined;
    nodeId?: never;
    selected?: never;
    onSelected?: never;
} | {
    href?: never;
    nodeId: string;
    selected?: boolean;
    onSelected: (nodeId: string) => void;
} | {
    href?: never;
    nodeId?: never;
    selected?: never;
    onSelected?: never;
};

export type ListItemPropsCommon = {
    label: ReactElement | string | undefined;
    disabled?: boolean;
    startDecorator?: ReactElement;
    endDecorator?: ReactElement;
    className?: string;
};

export function ListItem({
    nodeId,
    label,
    startDecorator,
    endDecorator,
    selected,
    onSelected,
    disabled,
    href,
    className
}: ListItemPropsCommon & ListItemPropsOptions) {
    const handleClick = () => {
        if (onSelected) {
            onSelected(nodeId);
        }
    };

    if (!href && !nodeId && !onSelected) {
        return (
            <Row spacing={2} className={cx('uitw-min-h-[3rem] uitw-px-2', className)}>
                {startDecorator ?? null}
                <div className={cx('uitw-grow', disabled && 'uitw-opacity-60')}>{label}</div>
                <div className="uitw-self-end">
                    {endDecorator ?? null}
                </div>
            </Row>
        );
    }

    return (
        <Button
            href={href}
            variant={selected ? 'soft' : 'plain'}
            onClick={handleClick}
            disabled={disabled}
            className={cx('uitw-text-start', className)}>
            {startDecorator ?? null}
            <div className="uitw-grow">{label}</div>
            <div className="uitw-self-end">
                {endDecorator ?? null}
            </div>
        </Button>
    );
}
