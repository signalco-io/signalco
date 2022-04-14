import { FormBuilderComponents } from "@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types";
import { Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";

const components: FormBuilderComponents = {
    string: (props) => <TextField variant="filled" hiddenLabel={!props.label} {...props} />,
    number: (props) => <TextField type="number" variant="filled" hiddenLabel={!props.label} {...props} />,
    yesno: (props) => (
        <FormGroup>
            <FormControlLabel
                control={<Checkbox checked={props.value} onChange={(e) => props.onChange && props.onChange(e.target.checked)} />}
                label={props.label} />
        </FormGroup>
    )
};

export default components;
