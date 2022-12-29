import { TextField, Checkbox } from '@signalco/ui';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';

const components: FormBuilderComponents = {
    number: (props) => <TextField type="number" {...props} />,
    yesno: (props) => (
        <Checkbox
            checked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
            label={props.label} />
    ),
    string: (props) => <TextField fullWidth {...props} />,
    stringReadonly: ({ value, ...props }) => <TextField fullWidth defaultValue={value} {...props} />
};

export default components;
