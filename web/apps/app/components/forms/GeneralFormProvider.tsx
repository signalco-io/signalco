import { ChildrenProps } from '@signalco/ui';
import { FormBuilderProvider } from '@enterwell/react-form-builder';
import formComponents from './generalFormComponents';

export default function GeneralFormProvider(props: ChildrenProps) {
    return (
        <FormBuilderProvider components={formComponents}>
            {props.children}
        </FormBuilderProvider>
    )
}
