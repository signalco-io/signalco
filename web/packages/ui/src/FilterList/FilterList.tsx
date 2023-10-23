import { Children, type PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import cx from 'classix';
import { Check, Close, ExpandDown } from '@signalco/ui-icons';
import { Typography } from '../Typography';
import { Stack } from '../Stack';
import { SelectItems } from '../SelectItems';
import { Row } from '../Row';
import { NoDataPlaceholder } from '../NoDataPlaceholder';
import { Loadable, LoadableProps } from '../Loadable';
import { Grow } from '../Grow';
import { Fade } from '../Fade';
import { Collapse } from '../Collapse';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';

export type FilterListItem = {
    id: string;
    label: string;
}

export type FilterListProps = {
    items: FilterListItem[];
    header?: string;
    placeholder?: string;
    selected?: string | string[] | null | undefined;
    truncate?: number | undefined;
    multiple?: boolean;
    variant?: 'checkbox' | 'highlight';
    onSelected?: (selectedId: string | undefined) => void;
    onSelectedMultiple?: (selectedIds: string[]) => void;
}

function FilterItem({ item, checked, variant, onToggle }: { item: FilterListItem, checked: string[], variant: 'checkbox' | 'highlight', onToggle: (id: string) => void }) {
    const active = checked.indexOf(item.id) >= 0;
    return (
        <Checkbox
            key={item.id}
            label={(
                <Row
                    justifyContent="space-between"
                    className={cx(
                        'min-h-[40px] p-2 rounded-md',
                        'hover:bg-muted/60',
                        active && variant === 'highlight' && 'bg-muted'
                    )}
                >
                    <span>
                        {item.label}
                    </span>
                    {variant === 'checkbox' && (
                        <Grow appear={active}>
                            <Check />
                        </Grow>
                    )}
                </Row>
            )}
            checked={checked.indexOf(item.id) >= 0}
            onCheckedChange={() => onToggle(item.id)}
            disableIcon />
    );
}

type ItemsWrapperProps = PropsWithChildren<LoadableProps & { noItemsPlaceholder: string, itemsWrapper?: React.FunctionComponent | undefined }>;

export function ItemsWrapper({ children, noItemsPlaceholder, itemsWrapper, ...rest }: ItemsWrapperProps) {
    const ItemsWrapper = itemsWrapper ?? (({ children }: PropsWithChildren) => <>{children}</>);
    return (
        <Loadable {...rest}>
            {!children || !Array.isArray(children) || children.length === 0 ? (
                <NoDataPlaceholder content={noItemsPlaceholder} />
            ) : (
                <ItemsWrapper>{children}</ItemsWrapper>
            )}
        </Loadable>
    )
}

export type ItemsShowMoreProps = ItemsWrapperProps & { truncate?: number | undefined };

export function ItemsShowMore({ children, truncate, itemsWrapper, ...rest }: ItemsShowMoreProps) {
    const [isShowAll, setIsShowAll] = useState<boolean>(false);

    const Wrapper = itemsWrapper ?? (({ children }: PropsWithChildren) => <>{children}</>);

    const items = Children.toArray(children);
    const shouldTruncate = typeof truncate === 'number' && !isShowAll && items.length > truncate;

    return (
        <Stack spacing={1}>
            <ItemsWrapper itemsWrapper={itemsWrapper} {...rest}>
                {items.slice(0, truncate)}
            </ItemsWrapper>
            {typeof truncate === 'number' && (
                <Collapse appear={!shouldTruncate}>
                    <Wrapper>
                        {items.slice(truncate)}
                    </Wrapper>
                </Collapse>
            )}
            <Fade appear={shouldTruncate}>
                <Button
                    className={cx(!shouldTruncate && 'hidden')}
                    fullWidth
                    size="sm"
                    variant="plain"
                    startDecorator={<ExpandDown />}
                    onClick={() => setIsShowAll(true)}>Show all ({items.length - (truncate ?? 0)} more)</Button>
            </Fade>
        </Stack>
    );
}

export function FilterList({
    header,
    placeholder,
    items,
    truncate,
    multiple,
    selected,
    variant = 'checkbox',
    onSelected,
    onSelectedMultiple,
}: FilterListProps) {
    const [checked, setChecked] = useState<string[]>(Array.isArray(selected) ? selected : (selected ? [selected] : []));

    useEffect(() => {
        setChecked(Array.isArray(selected) ? selected : (selected ? [selected] : []));
    }, [selected]);

    const handleToggle = (value: string) => {
        setChecked(checked.includes(value)
            ? checked.filter(i => i !== value)
            : (multiple ? [...checked, value] : [value]));
    };

    const handleClearSelection = () => setChecked([]);

    useEffect(() => {
        if (onSelected)
            onSelected(checked.length ? checked[0] : undefined);
        if (onSelectedMultiple)
            onSelectedMultiple(checked);
    }, [checked, onSelected, onSelectedMultiple]);

    return (
        <Stack>
            <div className="sm:uitw-hidden">
                <SelectItems
                    items={items.map(i => ({ value: i.id, label: i.label }))}
                    value={checked?.at(0)}
                    label={header}
                    placeholder={placeholder ?? header ? `Select ${placeholder ?? header}` : undefined}
                    className="uitw-w-full"
                    onValueChange={(value) => {
                        handleToggle(value);
                    }} />
            </div>
            <div className="uitw-hidden sm:uitw-block">
                {header && <Typography level="h5" gutterBottom>{header}</Typography>}
                <ItemsShowMore
                    truncate={truncate}
                    loadingLabel={'Loading'}
                    noItemsPlaceholder={'Not available'}
                    itemsWrapper={({ children }: PropsWithChildren) => <Stack>{children}</Stack>}>
                    {items.map(item => (
                        <FilterItem key={item.id} item={item} checked={checked} variant={variant} onToggle={handleToggle} />
                    ))}
                </ItemsShowMore>
                {(checked.length > 0 && (
                    <Button fullWidth startDecorator={<Close />} variant="plain" size="sm" onClick={handleClearSelection}>Clear selection</Button>
                ))}
            </div>
        </Stack>
    );
}
