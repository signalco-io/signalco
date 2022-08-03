import { IconButton, Slider, Stack, Switch, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import IContact from 'src/contacts/IContact';
import blendColors from 'src/helpers/BlendColors';
import throttle from 'src/helpers/Throttle';
import SelectItems from '../form/SelectItems';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';

export interface InputContactValueProps {
    value: any | undefined;
    contact: IContact | undefined;
    onChange: (value: any) => void;
}

export default function InputContactValue(props: InputContactValueProps) {
    const { value, onChange } = props;

    const dataType: string = 'string'; // TODO: Add data type to contact props.pointer.dataType;
    const dataValues: ({ value: any })[] | undefined = []; // TODO: Use info from contact
    const dataValuesMultiple = false; // TODO: Use info from contact

    const [sliderValue, setSliderValue] = useState<number | number[] | undefined>();
    const [sliderColor, setSliderColor] = useState<string | undefined>();
    const [dataValuesSelected, setDataValueSelected] = useState<string[]>(dataValues && dataValues.length ? [value ?? dataValues[0].value] : []);
    const requestDoubleChangeMemoized = useCallback(throttle(async (value) => {
        console.log('Do double change', 'contact:', props.contact, 'state:', value, 'value:', value);
        onChange(value);
    }, 500), []);

    const handleActionClick = async () => {
        console.debug('Do action', 'contact:', props.contact, 'state:', value, 'dataValuesSelected:', dataValuesSelected);

        onChange(dataValuesMultiple ? dataValuesSelected : dataValuesSelected[0]);
    };

    const handleDoubleChange = (_: Event | React.SyntheticEvent, value: number | number[]) => {
        console.debug('double changed', value)
        setSliderValue(value);
        requestDoubleChangeMemoized(value);
    };

    const handleColorTemperatureChange = (_: Event | React.SyntheticEvent, value: number | number[]) => {
        setSliderValue(value);
        requestDoubleChangeMemoized(value);
    };

    const handleDataValuesChanged = (values: string[]) => {
        console.debug('selected', values)
        setDataValueSelected(values);
    }

    useEffect(() => {
        if ((dataType === 'colortemp' || dataType === 'double') &&
            typeof sliderValue === 'number') {
            if (dataType === 'colortemp') {
                setSliderColor(blendColors('#ffffff', '#C47A10', sliderValue));
            }
            const valueNumber = typeof value !== 'undefined' ? Number.parseFloat(value) || undefined : undefined;
            if (typeof valueNumber !== 'undefined' && Math.abs(valueNumber - sliderValue) < 0.01) {
                setSliderValue(undefined);
            }
        }
    }, [value, dataType, sliderValue]);

    if (dataType === 'bool') {
        const boolValue = typeof value === 'boolean' ? value : value === 'true';
        return <Switch onChange={(_, checked) => onChange(checked)} checked={boolValue} color="warning" />
    } else if (dataType === 'action' || dataType === 'enum') {
        return (
            <Stack alignItems="center" direction="row">
                {dataValues && <SelectItems
                    value={dataValuesSelected}
                    items={dataValues}
                    multiple={dataValuesMultiple}
                    onChange={handleDataValuesChanged}
                    label={''} />}
                <IconButton onClick={handleActionClick} size="large"><PlayArrowIcon /></IconButton>
            </Stack>
        );
    } else if (dataType === 'double') {
        const resolvedSliderValue = sliderValue ?? (typeof value !== 'undefined' ? Number.parseFloat(value) || undefined : undefined);
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
            marks={[
                { label: 'Low', value: 0 },
                { label: 'High', value: 1 }
            ]}
            onChange={handleDoubleChange}
            onChangeCommitted={handleDoubleChange} />
    } else if (dataType === 'colortemp') {
        const resolvedSliderValue = sliderValue ?? (typeof value !== 'undefined' ? Number.parseFloat(value) || undefined : undefined);
        return <Slider
            step={0.01}
            sx={{ width: '100px', color: sliderColor, mr: 2 }} min={0} max={1} value={resolvedSliderValue}
            marks={[
                { label: 'Cold', value: 0 },
                { label: 'Warm', value: 1 }
            ]}
            onChange={handleColorTemperatureChange}
            onChangeCommitted={handleColorTemperatureChange} />
    } else {
        return <Typography color="textSecondary" variant="caption">Action for this contact not supported yet.</Typography>
    }
}
