import { Input } from '@signalco/ui-primitives/Input';
import { Checkbox } from '@signalco/ui-primitives/Checkbox';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/FormBuilderProvider/FormBuilderProvider.types';

export const components: FormBuilderComponents = {
    number: (props) => <Input type="number" {...props} />,
    yesno: (props) => (
        <Checkbox
            checked={props.value}
            onCheckedChange={(checked) => props.onChange(checked === true, { receiveEvent: false })}
            label={props.label} />
    ),
    string: (props) => <Input className="w-full" {...props} />,
    stringReadonly: ({ value, ...props }) => <Input className="w-full" defaultValue={value} {...props} />
};
