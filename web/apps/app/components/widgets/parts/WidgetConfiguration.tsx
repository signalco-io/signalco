import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Button } from '@signalco/ui-primitives/Button';
import { asArray, ObjectDictAny } from '@signalco/js';
import { extractValues } from '@enterwell/react-form-validation';
import { FormBuilder, type FormItems, useFormField, FormBuilderProvider, FormBuilderComponents } from '@enterwell/react-form-builder';
import DisplayEntityTarget from '../../shared/entity/DisplayEntityTarget';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import GeneralFormProvider from '../../forms/GeneralFormProvider';
import WidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';

type WidgetConfigurationDialogProps = {
    form: FormItems,
    onCancel: () => void,
    onSave: (config: object) => void,
}

export type WidgetConfigurationProps = {
    isOpen: boolean,
    config: object,
    options: WidgetConfigurationOption<unknown>[],
    onConfiguration: (config: object) => void,
}

const useWidgetConfiguration = (
    options: WidgetConfigurationOption<unknown>[],
    config: object | undefined,
    onConfiguration: (config: object) => void) => {
    const form: ObjectDictAny = {};
    for (let index = 0; index < options.length; index++) {
        const configOption = options[index];
        if (!configOption) {
            continue;
        }
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
    } as WidgetConfigurationDialogProps;
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
    selectVisual: (props) => (<SelectItems
        label="Visual"
        items={[{ label: 'TV', value: 'tv' }, { label: 'Light bulb', value: 'lightbulb' }, { label: 'Fan', value: 'fan' }]}
        placeholder="Select visual"
        className="w-full"
        value={props.value}
        onValueChange={(item: string) => item && props.onChange(item, { receiveEvent: false })} />),
    wrapper: (props) => <Stack spacing={2}>{props.children}</Stack>
};

function WidgetConfigurationFormProvider(props: PropsWithChildren) {
    return (
        <GeneralFormProvider>
            <FormBuilderProvider components={widgetConfigurationFormComponents}>
                {props.children}
            </FormBuilderProvider>
        </GeneralFormProvider>
    )
}

function WidgetConfiguration(props: WidgetConfigurationProps) {
    const configProps = useWidgetConfiguration(props.options, props.config, props.onConfiguration)
    return (
        <ConfigurationDialog
            header="Configure widget"
            open={props.isOpen}
            onClose={configProps.onCancel}
            actions={(
                <>
                    <Button onClick={configProps.onCancel}>Cancel</Button>
                    <Button autoFocus onClick={configProps.onSave}>Save changes</Button>
                </>
            )}>
            <WidgetConfigurationFormProvider>
                <FormBuilder form={configProps.form} onSubmit={configProps.onSave} />
            </WidgetConfigurationFormProvider>
        </ConfigurationDialog>
    );
}

export default WidgetConfiguration;
