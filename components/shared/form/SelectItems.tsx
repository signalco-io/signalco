import React, { ReactElement } from 'react';
import { Select, Option } from '@mui/joy';

export interface ISelectItemsProps {
    multiple?: boolean,
    value: string[],
    label?: string,
    items: { value: string, label?: ReactElement | string, disabled?: boolean }[],
    onChange: (values: string[]) => void,
    placeholder?: string,
    fullWidth?: boolean
}

function SelectItems(props: ISelectItemsProps) {
    const {
        value,
        items,
        placeholder,
        onChange
    } = props;

    const handleOnChange = (_: any, value: string | string[] | null) => {
        onChange(typeof value === 'string' ? value.split(',') : (value ?? []));
    };

    return (
        <Select
            value={value?.at(0)}
            placeholder={placeholder}
            onChange={handleOnChange}
            renderValue={(selected) => {
                // if (multiple)
                //     return (
                //         <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                //             {selected.map((value) => (
                //                 <Box key={value} sx={{ m: '2px' }}>
                //                     <Chip>{items.find(i => i.value === value)?.label ?? value}</Chip>
                //                 </Box>
                //             ))}
                //         </Box>
                //     );
                // else {
                    return items.find(i => i.value === selected?.value)?.label ?? value;
                // }
            }}
        >{items.map(item => (
            <Option
                value={item.value}
                key={item.value}
                disabled={item.disabled}>
                {/* {multiple && <Checkbox checked={value.indexOf(item.value) > -1} />} */}
                {item.label ?? item.value}
            </Option>)
        )}
        </Select>
    );
}

export default SelectItems;
