import React, { useEffect, useState } from 'react';
import { Stack, List, Typography, ListItemButton, ListItemIcon, Checkbox, ListItemText, Box, Button } from '@mui/material';
import { ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import SelectItems from '../form/SelectItems';

export interface FilterListItem {
    id: string;
    label: string;
}

export interface FilterListProps {
    header: string;
    items: FilterListItem[];
    selected?: string | string[] | undefined;
    truncate?: number | undefined;
    multiple?: boolean;
    compact?: boolean;
    onSelected?: (selectedId: string | undefined) => void;
    onSelectedMultiple?: (selectedIds: string[]) => void;
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
        compact
    } = props;

    const [checked, setChecked] = useState<string[]>(Array.isArray(selected) ? selected : (selected ? [selected] : []));
    const [isShowMore, setIsShowMore] = useState<boolean>(false);

    useEffect(() => {
        setChecked(Array.isArray(selected) ? selected : (selected ? [selected] : []));
    }, [selected]);

    const handleToggle = (value: string) => {
        console.log('handleToggle')

        const currentIndex = checked.indexOf(value);
        const newChecked = multiple ? [...checked] : [];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);

        console.log('toggle2', newChecked)

        if (onSelected)
            onSelected(newChecked.length ? newChecked[0] : undefined);
        if (onSelectedMultiple)
            onSelectedMultiple(newChecked);
    };
    const handleToggleShowMore = () => setIsShowMore(true);
    const shouldTruncate = typeof truncate !== 'undefined' && items.length > truncate;

    console.log('checked', checked)

    return (
        <Stack>
            {compact ? (
                <SelectItems
                    items={items.map(i => ({ value: i.id, label: i.label }))}
                    value={checked}
                    label={header}
                    multiple={multiple}
                    fullWidth
                    onChange={(values) => {
                        values.forEach(changedValue => {
                            handleToggle(changedValue);
                        });
                    }} />
            ) : (
                <>
                    <List subheader={(
                        <Stack direction="row" spacing={1}>
                            <Typography gutterBottom variant="h4">{header}</Typography>
                            {(!isShowMore && shouldTruncate) && <Typography color="textSecondary">({items.length - truncate} more)</Typography>}
                        </Stack>
                    )}>
                        {items.slice(0, isShowMore ? items.length : truncate).map(item => (
                            <ListItemButton
                                key={item.id}
                                role={undefined}
                                onClick={() => handleToggle(item.id)} sx={{ py: 0 }}
                                selected={checked.indexOf(item.id) >= 0}>
                                {multiple && (
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(item.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': item.id }} />
                                    </ListItemIcon>
                                )}
                                <ListItemText id={item.id} primary={item.label} primaryTypographyProps={{ noWrap: true }} />
                            </ListItemButton>
                        ))}
                    </List>
                    {(!isShowMore && shouldTruncate) && (
                        <Box>
                            <Button startIcon={<ArrowDownwardIcon />} onClick={handleToggleShowMore}>Show all</Button>
                        </Box>
                    )}
                </>
            )}
        </Stack>
    );
}
