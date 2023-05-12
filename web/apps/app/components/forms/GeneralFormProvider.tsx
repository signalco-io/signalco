import { PropsWithChildren } from 'react';
import { FormBuilderProvider } from '@enterwell/react-form-builder';
import formComponents from './generalFormComponents';

export default function GeneralFormProvider(props: PropsWithChildren) {
    return (
        <FormBuilderProvider components={formComponents}>
            {props.children}
        </FormBuilderProvider>
    )
}
