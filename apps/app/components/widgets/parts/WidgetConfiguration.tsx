import React from 'react';
import { Stack, Button, SelectItems } from '@signalco/ui';
import { extractValues } from '@enterwell/react-form-validation';
import { FormBuilder, type FormItems, useFormField, FormBuilderProvider, FormBuilderComponents } from '@enterwell/react-form-builder';
import DisplayEntityTarget from '../../shared/entity/DisplayEntityTarget';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import GeneralFormProvider from '../../forms/GeneralFormProvider';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { ChildrenProps, ObjectDictAny } from '../../../src/sharedTypes';
import { asArray } from '../../../src/helpers/ArrayHelpers';

interface IWidgetConfigurationDialogProps {
    form: FormItems,
    onCancel: () => void,
    onSave: (config: object) => void,
}

export interface IWidgetConfigurationProps {
    isOpen: boolean,
    config: object,
    options: IWidgetConfigurationOption<unknown>[],
    onConfiguration: (config: object) => void,
}

const useWidgetConfiguration = (
    options: IWidgetConfigurationOption<unknown>[],
    config: object | undefined,
    onConfiguration: (config: any) => void) => {
    const form: ObjectDictAny = {};
    for (let index = 0; index < options.length; index++) {
        const configOption = options[index];
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const field = useFormField(
            config ? config[configOption.name] : undefined,
            () => true,
            configOption.type,
            configOption.label);
        form[configOption.name] = field;
    }

    const handleCancelConfiguration = () => {
        onConfiguration(config || {});
    };

    const handleSaveConfiguration = () => {
        const values = extractValues(form);

        // Include default values
        options.filter(o => o.default).forEach(defaultOpt => {
            if (Object.keys(values).indexOf(defaultOpt.name) < 0) {
                values[defaultOpt.name] = defaultOpt.default;
            }
        })

        // Submit
        onConfiguration(values);
    }

    return {
        onCancel: handleCancelConfiguration,
        onSave: handleSaveConfiguration,
        form
    } as IWidgetConfigurationDialogProps;
};

const widgetConfigurationFormComponents: FormBuilderComponents = {
    entity: (props) => <DisplayEntityTarget target={props.value} onChanged={t => props.onChange(t, { receiveEvent: false })} />,
    entityContactMultiple: (props) => {
        const valueItems = asArray(props.value).filter(p => !!p);
        valueItems.push(undefined); // Push new item as last
        return (
            <>
                {valueItems.map((value, i) => (
                    <DisplayEntityTarget
                        selectContact
                        key={`option-${i}`}
                        target={value}
                        onChanged={t => {
                            const newValues = [...valueItems];
                            newValues[i] = t;
                            return props.onChange(newValues.filter(i => typeof i !== 'undefined'), { receiveEvent: false });
                        }} />
                ))}
            </>
        );
    },
    entityContactValueMultiple: (props) => {
        const valueItems = asArray(props.value).filter(p => !!p);
        valueItems.push(undefined); // Push new item as last
        return (
            <>
                {valueItems.map((value, i) => (
                    <DisplayEntityTarget
                        selectContact
                        selectValue
                        key={`option-${i}`}
                        target={value}
                        onChanged={t => {
                            const newValues = [...valueItems];
                            newValues[i] = t;
                            return props.onChange(newValues.filter(i => typeof i !== 'undefined'), { receiveEvent: false });
                        }} />
                ))}
            </>
        );
    },
    entityContact: (props) => <DisplayEntityTarget selectContact target={props.value} onChanged={t => props.onChange(t, { receiveEvent: false })} />,
    entityContactValue: (props) => <DisplayEntityTarget selectContact selectValue target={props.value} onChanged={t => props.onChange(t, { receiveEvent: false })} />,
    selectVisual: (props) => <SelectItems
        label="Visual"
        items={[{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }]}
        placeholder="Select visual"
        fullWidth
        value={props.value}
        onChange={(item) => item && item.length && props.onChange(item[0], { receiveEvent: false })} />
};

function WidgetConfigurationFormProvider(props: ChildrenProps) {
    return (
        <GeneralFormProvider>
            <FormBuilderProvider components={widgetConfigurationFormComponents}>
                {props.children}
            </FormBuilderProvider>
        </GeneralFormProvider>
    )
}

function WidgetConfiguration(props: IWidgetConfigurationProps) {
    const configProps = useWidgetConfiguration(props.options, props.config, props.onConfiguration)
    return (
        <>
            {props.isOpen && (
                <ConfigurationDialog
                    header="Configure widget"
                    isOpen={props.isOpen}
                    onClose={configProps.onCancel}
                    actions={(
                        <>
                            <Button onClick={configProps.onCancel}>Cancel</Button>
                            <Button autoFocus onClick={configProps.onSave}>Save changes</Button>
                        </>
                    )}>
                    <Stack spacing={2}>
                        <WidgetConfigurationFormProvider>
                            <FormBuilder form={configProps.form} onSubmit={configProps.onSave} />
                        </WidgetConfigurationFormProvider>
                    </Stack>
                </ConfigurationDialog>
            )}
        </>
    );
}

export default WidgetConfiguration;
