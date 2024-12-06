import { useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Modal } from '@signalco/ui-primitives/Modal';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { GeneralFormProvider } from '@signalco/ui-forms/GeneralFormProvider';
import { CopyToClipboardInput } from '@signalco/ui/CopyToClipboardInput';
import { noError, submitForm, resetFields, Fields } from '@enterwell/react-form-validation';
import { FormBuilder, useFormField } from '@enterwell/react-form-builder';
import { useCreateAuthPat } from '../../../src/hooks/signalco/pats/useCreateAuthPat';

export function CreateAuthPatButton() {
    const createPat = useCreateAuthPat();
    const [open, setOpen] = useState(false);
    const [pat, setPat] = useState<string>();

    const form = {
        alias: useFormField('', noError, 'string', 'Alias'),
        expire: useFormField('', noError, 'dateTimeFuture', 'Expire'),
    };

    const handleOpen = () => {
        setPat(undefined);
        resetFields(form as unknown as Fields);
        setOpen(true);
    }

    const handleCreate = async (data: object) => {
        try {
            const pat = await createPat.mutateAsync(data);
            setPat(pat?.pat);
            showNotification('PAT created', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error creating PAT', 'error');
        }
    };

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Modal
            title="Create PAT"
            open={open}
            onOpenChange={(newOpen) => newOpen ? handleOpen() : handleClose()}
            trigger={(
                <Button>New PAT...</Button>
            )}>
            <Stack spacing={2}>
                {pat && (
                    <>
                        <p>Here is your new PAT</p>
                        <CopyToClipboardInput defaultValue={pat} />
                        <p>Make sure to copy it now, as you will not be able to see it again.</p>
                        <Button onClick={handleClose}>Close</Button>
                    </>
                )}
                {!pat && (
                    <>
                        <GeneralFormProvider>
                            <FormBuilder form={form} onSubmit={handleCreate} />
                        </GeneralFormProvider>
                        <Button onClick={() => submitForm(form as unknown as Fields, handleCreate)}>Create</Button>
                    </>
                )}
            </Stack>
        </Modal>
    );
}
