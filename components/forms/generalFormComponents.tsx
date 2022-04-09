import { FormBuilderComponents } from "@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types";
import { TextField } from "@mui/material";

const components: FormBuilderComponents = {
    string: (props) => <TextField variant="filled" hiddenLabel={!props.label} {...props} />
};

export default components;
