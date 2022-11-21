import React, { useEffect, useState } from 'react';
import { ExpandDown } from '@signalco/ui-icons';
import { Row, Stack , Typography, Button } from '@signalco/ui';
import { Box } from '@mui/system';
import SelectItems from '../form/SelectItems';
import Checkbox from '../form/Checkbox';

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
    } = props;

    const [checked, setChecked] = useState<string[]>(Array.isArray(selected) ? selected : (selected ? [selected] : []));
    const [isShowMore, setIsShowMore] = useState<boolean>(false);

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
    const handleToggleShowMore = () => setIsShowMore(true);
    const shouldTruncate = typeof truncate !== 'undefined' && items.length > truncate;

    return (
        <Stack>
            <Box sx={{ dispaly: { xs: 'visible', md: 'none' } }}>
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
            </Box>
            <Box sx={{ dispaly: { xs: 'none', md: 'visible' } }}>
                <Row spacing={1}>
                    <Typography gutterBottom level="h5">{header}</Typography>
                    {(!isShowMore && shouldTruncate) && <Typography level="body2">({items.length - truncate} more)</Typography>}
                </Row>
                <Stack>
                    {items.slice(0, isShowMore ? items.length : truncate).map(item => (
                        <Checkbox
                            key={item.id}
                            sx={{ p: 2 }}
                            label={item.label} checked={checked.indexOf(item.id) >= 0}
                            onChange={() => handleToggle(item.id)}
                            disableIcon />
                    ))}
                </Stack>
                {(!isShowMore && shouldTruncate) && (
                    <Box>
                        <Button startDecorator={<ExpandDown />} onClick={handleToggleShowMore}>Show all</Button>
                    </Box>
                )}
            </Box>
        </Stack>
    );
}
