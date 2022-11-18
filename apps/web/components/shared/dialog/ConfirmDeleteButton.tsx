import React, { useState } from 'react';
import { Breakpoint } from '@mui/system';
import { Button } from '@mui/joy';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export interface ConfirmDeleteButtonDialogProps {
    header: React.ReactNode,
    expectedConfirmText: string,
    onConfirm: () => void,
    maxWidth?: false | undefined | Breakpoint,
}

export interface ConfirmDeleteButtonProps extends ConfirmDeleteButtonDialogProps {
    buttonLabel: string
}

function ConfirmDeleteButton(props: ConfirmDeleteButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        props.onConfirm();
    }

    return (
        <>
            <Button variant="outlined" color="danger" onClick={() => setIsOpen(true)}>{props.buttonLabel}</Button>
            <ConfirmDeleteDialog isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} onConfirm={handleConfirm} />
        </>
    )
}

export default ConfirmDeleteButton;
