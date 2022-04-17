import { Button } from '@mui/material';
import { Breakpoint } from '@mui/system';
import React, { useState } from 'react';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export interface IConfirmDeleteButtonDialogProps {
    title: React.ReactNode,
    expectedConfirmText: string,
    onConfirm: () => void,
    maxWidth?: false | undefined | Breakpoint,
}

export interface IConfirmDeleteButtonProps extends IConfirmDeleteButtonDialogProps {
    buttonLabel: string
}

const ConfirmDeleteButton = (props: IConfirmDeleteButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        props.onConfirm();
    }

    return (
        <>
            <Button variant="outlined" color="error" onClick={() => setIsOpen(true)}>{props.buttonLabel}</Button>
            <ConfirmDeleteDialog isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} onConfirm={handleConfirm} />
        </>
    )
};

export default ConfirmDeleteButton;