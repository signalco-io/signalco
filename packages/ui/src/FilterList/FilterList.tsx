import { useEffect, useState } from 'react';
import { Check, Close, ExpandDown } from '@signalco/ui-icons';
import SelectItems from '../SelectItems';
import Checkbox from '../Checkbox';
import { Typography, Button } from '@mui/joy';
import { Box } from '@mui/system';
import Row from '../Row';
import Stack from '../Stack';
import Grow from '../Grow';

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
                <Row spacing={1}>
                    <Typography gutterBottom level="h5">{header}</Typography>
                    {(!isShowMore && shouldTruncate) && <Typography level="body2">({items.length - truncate} more)</Typography>}
                </Row>
                <Stack>
                    {items.slice(0, isShowMore ? items.length : truncate).map(item => (
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
                            onChange={() => handleToggle(item.id)}
                            disableIcon />
                    ))}
                </Stack>
                {(!isShowMore && shouldTruncate) && (
                    <Button fullWidth variant="plain" startDecorator={<ExpandDown />} onClick={handleToggleShowMore}>Show all</Button>
                )}
                {(checked.length > 1 && (
                    <Button fullWidth startDecorator={<Close />} variant="plain" size="sm" onClick={handleClearSelection}>Clear selection</Button>
                ))}
            </Box>
        </Stack>
    );
}
