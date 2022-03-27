import { FormBuilderComponents } from "@enterwell/react-form-builder/lib/esm/FormBuilderProvider/FormBuilderProvider.types";
import { TextField } from "@mui/material";

const components: FormBuilderComponents = {
    string: (props) => <TextField {...props} />
};

export default components;