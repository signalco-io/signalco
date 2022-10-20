import { ReactElement } from 'react';
import { Radio, RadioGroup } from '@mui/joy';

export default function Picker(props: { value?: any, setValue: (value: any) => void, options: { value: any, label: ReactElement }[] }) {
    const { value, options, setValue } = props;
    return (
        <RadioGroup
            row
            name="justify"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{
                minHeight: 48,
                padding: '4px',
                borderRadius: 'md',
                bgcolor: 'neutral.softBg',
                '--RadioGroup-gap': '4px',
                '--Radio-action-radius': '8px',
            }}
        >
            {options.map((option) => (
                <Radio
                    key={option.value}
                    color="neutral"
                    value={option.value}
                    disableIcon
                    label={option.label}
                    variant="plain"
                    sx={{
                        px: 2,
                        alignItems: 'center',
                    }}
                    componentsProps={{
                        action: ({ checked }) => ({
                            sx: {
                                ...(checked && {
                                    bgcolor: 'background.surface',
                                    boxShadow: 'md',
                                    '&:hover': {
                                        bgcolor: 'background.surface',
                                    },
                                }),
                            },
                        }),
                    }}
                />
            ))}
        </RadioGroup>
    )
}
