import { Ref, type ReactElement, MouseEventHandler, CSSProperties } from 'react';
import { Row } from '../Row';
import { cx } from '../cx';
import { Button } from '../Button';

export type ListItemPropsOptions = {
    href: string | undefined;
    nodeId?: never;
    selected?: boolean | undefined;
    onSelected?: never;
    onMouseEnter?: never;
    divRef?: never;
    buttonRef?: Ref<HTMLButtonElement>;
} | {
    href?: never;
    nodeId: string;
    selected?: boolean;
    onSelected: (nodeId: string) => void;
    onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
    divRef?: never;
    buttonRef?: Ref<HTMLButtonElement>;
} | {
    href?: never;
    nodeId?: never;
    selected?: never;
    onSelected?: never;
    onMouseEnter?: never;
    divRef?: Ref<HTMLDivElement>;
    buttonRef?: never;
};

export type ListItemPropsCommon = {
    label: ReactElement | string | undefined;
    disabled?: boolean;
    startDecorator?: ReactElement;
    endDecorator?: ReactElement;
    className?: string;
    title?: string;
    style?: CSSProperties;
    /**
     * @default 'plain'
     */
    variant?: 'outlined' | 'plain';
};

export type ListItemProps = ListItemPropsCommon & ListItemPropsOptions;

export function ListItem({
    divRef,
    buttonRef,
    nodeId,
    label,
    startDecorator,
    endDecorator,
    selected,
    onSelected,
    onMouseEnter,
    disabled,
    href,
    className,
    title,
    style,
    variant = 'plain',
}: ListItemProps) {
    const handleClick = () => {
        onSelected?.(nodeId);
    };

    if (!href && !nodeId && !onSelected) {
        return (
            <Row
                ref={divRef}
                spacing={2}
                className={cx(
                    'min-h-[3rem] px-2',
                    variant === 'outlined' && 'rounded-none gap-2 first:rounded-t-[calc(var(--radius)-1px)] last:rounded-b-[calc(var(--radius)-1px)]',
                    className
                )}
                title={title}
                style={style}>
                {typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator ?? null}
                <div className={cx('grow', disabled && 'opacity-60')}>{label}</div>
                <>
                    {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator ?? null}
                </>
            </Row>
        );
    }

    return (
        <Button
            ref={buttonRef}
            href={href}
            variant={selected ? 'soft' : 'plain'}
            onClick={handleClick}
            onMouseEnter={onMouseEnter}
            disabled={disabled}
            title={title}
            style={style}
            className={cx(
                'text-start h-auto pl-2',
                variant === 'outlined' && 'rounded-none gap-2 first:rounded-t-[calc(var(--radius)-1px)] last:rounded-b-[calc(var(--radius)-1px)]',
                className
            )}>
            {typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator ?? null}
            {Boolean(label) && <div className="grow">{label}</div>}
            {Boolean(endDecorator) && (
                <>
                    {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator ?? null}
                </>
            )}
        </Button>
    );
}
