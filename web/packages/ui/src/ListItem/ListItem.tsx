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
            <Row spacing={2} className={cx('min-h-[3rem]', className)}>
                {startDecorator ?? null}
                <div className={cx('grow', disabled && 'opacity-60')}>{label}</div>
                <div className="self-end">
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
            startDecorator={startDecorator}
            endDecorator={endDecorator}
            className={cx('text-start', className)}>
            {label}
        </Button>
    );
}
