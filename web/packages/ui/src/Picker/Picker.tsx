import { Radio, RadioGroup } from '../Radio';
import { Tooltip } from '../Tooltip';
import { ChangeEvent, ReactElement } from 'react';

export type PickerOption = {
    value: any;
    label: ReactElement | string;
    disabled?: boolean;
    title?: string | undefined;
}

export type PickerProps<TValue> = {
    value: TValue | undefined;
    onChange: (event: ChangeEvent<HTMLInputElement>, value: TValue | undefined) => void;
    options: PickerOption[];
    size?: 'sm' | 'md';
    name?: string | undefined;
}

export function Picker<TValue>({ value, options, size, name, onChange }: PickerProps<TValue>) {
    return (
        <RadioGroup
            orientation="horizontal"
            value={value}
            name={name}
            onChange={(e) => onChange(e, e.target.value as (TValue | undefined))}
            sx={{
                alignSelf: 'start',
                minHeight: size === 'sm' ? 32 : 48,
                padding: size === 'sm' ? '2px' : '4px',
                borderRadius: 'md',
                bgcolor: 'neutral.softBg',
                '--RadioGroup-gap': size === 'sm' ? '2px' : '4px',
                '--Radio-actionRadius': '8px',
            }}
        >
            {options.map((option) => (
                <Tooltip title={option.title} key={option.value}>
                    <Radio
                        color="neutral"
                        disabled={option.disabled}
                        value={option.value}
                        disableIcon
                        label={option.label}
                        variant="plain"
                        sx={{
                            px: 2,
                            alignItems: 'center',
                        }}
                        slotProps={{
                            action: ({ checked }) => ({
                                sx: {
                                    ...(checked && {
                                        bgcolor: 'background.surface',
                                        boxShadow: size === 'sm' ? 'sm' : 'md',
                                        '&:hover': {
                                            bgcolor: 'background.surface',
                                        },
                                    }),
                                },
                            }),
                        }}
                    />
                </Tooltip>
            ))}
        </RadioGroup>
    )
}
