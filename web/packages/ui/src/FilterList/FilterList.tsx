import { useEffect, useState } from 'react';
import { Check, Close, ExpandDown } from '@signalco/ui-icons';
import SelectItems from '../SelectItems';
import Checkbox from '../Checkbox';
import { Typography, Button } from '@mui/joy';
import { Box } from '@mui/system';
import Row from '../Row';
import Stack from '../Stack';
import Grow from '../Grow';
import Collapse from '../Collapse';
import Fade from '../Fade';
import { ChildrenProps } from '../sharedTypes';
import Loadable, { LoadableProps } from '../Loadable';
import React from 'react';
import NoDataPlaceholder from '../NoDataPlaceholder';

export interface FilterListItem {
    id: string;
    label: string;
}

export interface FilterListProps {
    header: string;
    items: FilterListItem[];
    selected?: string | string[] | null | undefined;
    truncate?: number | undefined;
    multiple?: boolean;
    onSelected?: (selectedId: string | undefined) => void;
    onSelectedMultiple?: (selectedIds: string[]) => void;
}

function FilterItem({ item, checked, onToggle }: { item: FilterListItem, checked: string[], onToggle: (id: string) => void }) {
    return (
        <Checkbox
            key={item.id}
            label={(
                <Row style={{ padding: 12 }}>
                    <Typography sx={{ flexGrow: 1 }}>{item.label}</Typography>
                    <Grow appear={checked.indexOf(item.id) >= 0}>
                        <Check />
                    </Grow>
                </Row>
            )}
            checked={checked.indexOf(item.id) >= 0}
            onChange={() => onToggle(item.id)}
            disableIcon />
    );
}

type ItemsWrapperProps = ChildrenProps & LoadableProps & { noItemsPlaceholder: string, itemsWrapper?: React.FunctionComponent | undefined };

export function ItemsWrapper({ children, noItemsPlaceholder, itemsWrapper, ...rest }: ItemsWrapperProps) {
    const ItemsWrapper = itemsWrapper ?? (({ children }: ChildrenProps) => <>{children}</>);
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

    const Wrapper = itemsWrapper ?? (({ children }: ChildrenProps) => <>{children}</>);

    const items = React.Children.toArray(children);
    const shouldTruncate = typeof truncate === 'number' && !isShowAll && items.length > truncate;

    return (
        <Stack>
            <ItemsWrapper itemsWrapper={itemsWrapper} {...rest}>
                {items.slice(0, truncate)}
            </ItemsWrapper>
            <Collapse appear={!shouldTruncate}>
                <Wrapper>
                    {items.slice(truncate)}
                </Wrapper>
            </Collapse>
            <Fade appear={shouldTruncate}>
                <Button
                    fullWidth
                    size="sm"
                    variant="plain"
                    startDecorator={<ExpandDown />}
                    onClick={() => setIsShowAll(true)}>Show all</Button>
            </Fade>
        </Stack>
    );
}

export default function FilterList(props: FilterListProps) {
    const {
        header,
        items,
        truncate,
        multiple,
        selected,
        onSelected,
        onSelectedMultiple,
    } = props;

    const [checked, setChecked] = useState<string[]>(Array.isArray(selected) ? selected : (selected ? [selected] : []));

    useEffect(() => {
        setChecked(Array.isArray(selected) ? selected : (selected ? [selected] : []));
    }, [selected]);

    const handleToggle = (value: string) => {

        const currentIndex = checked.indexOf(value);
        const newChecked = multiple ? [...checked] : [];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);

        if (onSelected)
            onSelected(newChecked.length ? newChecked[0] : undefined);
        if (onSelectedMultiple)
            onSelectedMultiple(newChecked);
    };

    const handleClearSelection = () => setChecked([]);

    return (
        <Stack>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <SelectItems
                    items={items.map(i => ({ value: i.id, label: i.label }))}
                    value={checked}
                    label={header}
                    placeholder={`Select ${header}`}
                    multiple={multiple}
                    fullWidth
                    onChange={(values) => {
                        values.forEach(changedValue => {
                            handleToggle(changedValue);
                        });
                    }} />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography level="h5" gutterBottom>{header}</Typography>
                <ItemsShowMore
                    truncate={truncate}
                    loadingLabel={'Loading'}
                    noItemsPlaceholder={'Not available'}
                    itemsWrapper={({ children }: ChildrenProps) => <Stack>{children}</Stack>}>
                    {items.map(item => (
                        <FilterItem key={item.id} item={item} checked={checked} onToggle={handleToggle} />
                    ))}
                </ItemsShowMore>
                {(checked.length > 1 && (
                    <Button fullWidth startDecorator={<Close />} variant="plain" size="sm" onClick={handleClearSelection}>Clear selection</Button>
                ))}
            </Box>
        </Stack>
    );
}
