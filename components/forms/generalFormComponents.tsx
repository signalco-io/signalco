import { FormBuilderComponents } from "@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types";
import { TextField } from "@mui/material";

const components: FormBuilderComponents = {
    string: (props) => <TextField variant="filled" fullWidth hiddenLabel={!props.label} {...props} />,
    stringReadonly: (props) => <TextField variant="filled" fullWidth hiddenLabel={!props.label} {...props} onChange={() => { }} />
};

export default components;
