import { TextField } from '@signalco/ui/dist/TextField';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';

const components: FormBuilderComponents = {
    number: (props) => <TextField type="number" {...props} />,
    yesno: (props) => (
        <Checkbox
            checked={props.value}
            onCheckedChange={(checked) => props.onChange(checked === true, { receiveEvent: false })}
            label={props.label} />
    ),
    string: (props) => <TextField fullWidth {...props} />,
    stringReadonly: ({ value, ...props }) => <TextField fullWidth defaultValue={value} {...props} />
};

export default components;
