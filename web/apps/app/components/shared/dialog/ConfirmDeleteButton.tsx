import React, { useState } from 'react';
import { Button } from '@signalco/ui-primitives/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export interface ConfirmDeleteButtonDialogProps {
    header: React.ReactNode,
    expectedConfirmText: string,
    onConfirm: () => void,
    maxWidth?: false | undefined | 'sm' | 'md' | 'lg' | 'xl',
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
            <Button variant="outlined" className="border-red-700 hover:border-red-700/90" onClick={() => setIsOpen(true)}>{props.buttonLabel}</Button>
            <ConfirmDeleteDialog isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} onConfirm={handleConfirm} />
        </>
    )
}

export default ConfirmDeleteButton;
