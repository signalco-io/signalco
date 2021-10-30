import React from "react";
import { Box, Checkbox, Chip, FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from "@mui/material";

export interface ISelectItemsProps {
    multiple?: boolean,
    value: string[],
    items: { value: string, label?: string }[],
    onChange: (values: string[]) => void,
    placeholder?: string,
    fullWidth?: boolean
}

const SelectItems = (props: ISelectItemsProps) => {
    const {
        value,
        items,
        multiple = false,
        placeholder,
        fullWidth,
        onChange
    } = props;

    const handleOnChange = (event: SelectChangeEvent<typeof value>) => {
        const newValue = event.target.value;

        // On autofill we get a the stringified value.
        onChange(typeof newValue === 'string' ? newValue.split(',') : newValue);
    };

    return (
        <FormControl fullWidth={fullWidth}>
            <Select
                value={value}
                multiple={multiple}
                placeholder={placeholder}
                onChange={handleOnChange}
                fullWidth={fullWidth}
                renderValue={(selected) => {
                    if (multiple)
                        return (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={items.find(i => i.value === value)?.label ?? value} sx={{ m: '2px' }} />
                                ))}
                            </Box>
                        );
                    else {
                        return items.find(i => i.value === (Array.isArray(selected) ? value[0] : selected))?.label ?? value;
                    }
                }}
            >{items.map(item => (
                <MenuItem
                    value={item.value}
                    key={item.value}>
                    {multiple && <Checkbox checked={value.indexOf(item.value) > -1} />}
                    <ListItemText primary={item.label ?? item.value} />
                </MenuItem>)
            )}</Select>
        </FormControl>
    );
};

export default SelectItems;