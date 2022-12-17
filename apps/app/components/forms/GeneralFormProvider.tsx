import { FormBuilderProvider } from '@enterwell/react-form-builder';
import formComponents from './generalFormComponents';
import { ChildrenProps } from '../../src/sharedTypes';

export default function GeneralFormProvider(props: ChildrenProps) {
    return (
        <FormBuilderProvider components={formComponents}>
            {props.children}
        </FormBuilderProvider>
    )
}