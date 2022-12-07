import React, { ReactElement, useId } from 'react';
import { Select as SelectIcon } from '@signalco/ui-icons';
import { Select, Option, selectClasses, FormControl, FormLabel } from '@signalco/ui';

export interface ISelectItemsProps {
    multiple?: boolean,
    value: string[],
    label?: string,
    items: { value: string, label?: ReactElement | string, content?: ReactElement | string | undefined, disabled?: boolean }[],
    onChange: (values: string[]) => void,
    placeholder?: string,
    fullWidth?: boolean;
    heading?: boolean;
    minWidth?: number | undefined;
}

function SelectItems(props: ISelectItemsProps) {
    const {
        value,
        items,
        label,
        placeholder,
        heading,
        minWidth,
        onChange
    } = props;

    const uid = useId();
    const id = `select-field-${label ?? placeholder}-${uid}`;
    const handleOnChange = (_: any, value: string | string[] | null) => {
        onChange(typeof value === 'string' ? value.split(',') : (value ?? []));
    };

    return (
        <FormControl>
            {label && <FormLabel id={`${id}-label`} htmlFor={`${id}-button`}>{label}</FormLabel>}
            <Select
                value={value?.at(0)}
                // placeholder={placeholder} // NOTE: Violates contrast
                onChange={handleOnChange}
                variant={heading ? 'plain' : 'outlined'}
                size={heading ? 'lg' : undefined}
                slotProps={{
                    button: {
                        id: `${id}-button`,
                        // TODO: Material UI set aria-labelledby correctly & automatically
                        // but MUI Base and Joy UI don't yet.
                        'aria-labelledby': `${id}-label ${id}-button`,
                    },
                }}
                sx={{
                    fontSize: heading ? '1.4em' : undefined,
                    background: heading ? 'transparent' : undefined,
                    [`& .${selectClasses.indicator}`]: {
                        transition: '0.2s',
                        [`&.${selectClasses.expanded}`]: {
                            transform: 'rotate(-180deg)',
                        },
                    },
                    minWidth
                }}
                indicator={<SelectIcon />}
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
                    disabled={item.disabled}
                    label={item.label}>
                    {/* {multiple && <Checkbox checked={value.indexOf(item.value) > -1} />} */}
                    {item.content ?? (item.label ?? item.value)}
                </Option>)
            )}
            </Select>
        </FormControl>
    );
}

export default SelectItems;
