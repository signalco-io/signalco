import { type ReactElement } from 'react';
import { cx } from 'classix';
import { Row } from '../Row';
import { Button } from '../Button';

export type ListItemPropsOptions = {
    href: string | undefined;
    nodeId?: never;
    selected?: boolean | undefined;
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
    title?: string;
};

export type ListItemProps = ListItemPropsCommon & ListItemPropsOptions;

export function ListItem({
    nodeId,
    label,
    startDecorator,
    endDecorator,
    selected,
    onSelected,
    disabled,
    href,
    className,
    title
}: ListItemProps) {
    const handleClick = () => {
        if (onSelected) {
            onSelected(nodeId);
        }
    };

    if (!href && !nodeId && !onSelected) {
        return (
            <Row spacing={2} className={cx('uitw-min-h-[3rem] uitw-px-2', className)} title={title}>
                {typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator ?? null}
                <div className={cx('uitw-grow', disabled && 'uitw-opacity-60')}>{label}</div>
                <>
                    {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator ?? null}
                </>
            </Row>
        );
    }

    return (
        <Button
            href={href}
            variant={selected ? 'soft' : 'plain'}
            onClick={handleClick}
            disabled={disabled}
            title={title}
            className={cx('uitw-text-start uitw-h-auto', className)}>
            {typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator ?? null}
            {Boolean(label) && <div className="uitw-grow">{label}</div>}
            {Boolean(endDecorator) && (
                <>
                    {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator ?? null}
                </>
            )}
        </Button>
    );
}
