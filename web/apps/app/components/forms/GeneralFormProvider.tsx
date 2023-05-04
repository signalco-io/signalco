import { FormBuilderProvider } from '@enterwell/react-form-builder';
import formComponents from './generalFormComponents';
import { PropsWithChildren } from 'react';

export default function GeneralFormProvider(props: PropsWithChildren) {
    return (
        <FormBuilderProvider components={formComponents}>
            {props.children}
        </FormBuilderProvider>
    )
}
