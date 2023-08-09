import { type ReactElement } from 'react';
import { Typography } from '../Typography';
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
};

export function ListItem({
    nodeId,
    label,
    startDecorator,
    endDecorator,
    selected,
    onSelected,
    disabled,
    href
}: ListItemPropsCommon & ListItemPropsOptions) {
    const handleClick = () => {
        if (onSelected) {
            onSelected(nodeId);
        }
    };

    if (!href && !nodeId && !onSelected) {
        <Row spacing={1}>
            {startDecorator ?? null}
            <Typography opacity={disabled ? 0.6 : 1}>{label}</Typography>
            {endDecorator ?? null}
        </Row>
    }

    return (
        <Button
            href={href}
            variant={selected ? 'plain' : 'soft'}
            onClick={handleClick}
            disabled={disabled}
            startDecorator={startDecorator}
            endDecorator={endDecorator}>
            {label}
        </Button>
    );
}
