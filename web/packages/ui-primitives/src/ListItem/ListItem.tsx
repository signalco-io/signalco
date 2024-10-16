import { Ref, type ReactElement, MouseEventHandler, CSSProperties } from 'react';
import { cx } from '../cx';
import { Button } from '../Button';

export type ListItemPropsOptions = {
    href: string;
    nodeId?: never;
    selected?: boolean | undefined;
    onSelected?: never;
    onMouseEnter?: never;
    buttonRef?: Ref<HTMLAnchorElement>;
} | {
    href?: never;
    nodeId: string;
    selected?: boolean;
    onSelected: (nodeId: string) => void;
    onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
    buttonRef?: Ref<HTMLButtonElement>;
} | {
    href?: never;
    nodeId?: never;
    selected?: never;
    onSelected?: never;
    onMouseEnter?: never;
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
    variant = 'plain',
    ...rest
}: ListItemProps) {
    const handleClick = () => {
        onSelected?.(nodeId);
    };

    if (href) {
        return (
            <Button
                ref={buttonRef}
                href={href}
                fullWidth
                variant={selected ? 'soft' : 'plain'}
                onMouseEnter={onMouseEnter}
                disabled={disabled}
                className={cx(
                    'text-start h-auto pl-2',
                    variant === 'outlined' && 'rounded-none gap-2 first:rounded-t-[calc(var(--radius)-1px)] last:rounded-b-[calc(var(--radius)-1px)]',
                    className
                )}
                startDecorator={startDecorator}
                endDecorator={endDecorator}
                {...rest}>
                {Boolean(label) && <div className="min-w-0 grow">{label}</div>}
            </Button>
        );
    }

    return (
        <Button
            ref={buttonRef}
            fullWidth
            variant={selected ? 'soft' : 'plain'}
            onClick={handleClick}
            onMouseEnter={onMouseEnter}
            disabled={disabled}
            className={cx(
                'text-start h-auto pl-2',
                variant === 'outlined' && 'rounded-none gap-2 first:rounded-t-[calc(var(--radius)-1px)] last:rounded-b-[calc(var(--radius)-1px)]',
                className
            )}
            startDecorator={startDecorator}
            endDecorator={endDecorator}
            {...rest}>
            {Boolean(label) && <div className="min-w-0 grow">{label}</div>}
        </Button>
    );
}
