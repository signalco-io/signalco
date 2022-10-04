import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { FormBuilderComponents } from '@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types';

const components: FormBuilderComponents = {
    number: (props) => <TextField type="number" variant="filled" hiddenLabel={!props.label} {...props} />,
    yesno: (props) => (
        <FormGroup>
            <FormControlLabel
                control={<Checkbox checked={props.value} onChange={(e) => props.onChange(e.target.checked)} />}
                label={props.label} />
        </FormGroup>
    ),
    string: (props) => <TextField variant="filled" fullWidth hiddenLabel={!props.label} {...props} />,
    stringReadonly: ({ value, ...props }) => <TextField variant="filled" fullWidth hiddenLabel={!props.label} defaultValue={value} {...props} onChange={() => { }} />
};

export default components;
