import { PropsWithChildren } from 'react';
import { FormBuilderProvider } from '@enterwell/react-form-builder';
import { components } from './generalFormComponents';

export function GeneralFormProvider(props: PropsWithChildren) {
    return (
        <FormBuilderProvider components={components}>
            {props.children}
        </FormBuilderProvider>
    )
}
