import React, { useEffect, useState } from 'react';
import { cx } from 'classix';
import { Close, Save, Edit } from '@signalco/ui-icons';
import { Typography } from '../Typography';
import { Row } from '../Row';
import { Input } from '../Input';
import { IconButton } from '../IconButton';

export type EditableInputProps = {
    value: string,
    onChange: (text: string) => void
    className?: string;
}

export function EditableInput({
    value,
    onChange,
    className
}: EditableInputProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState(value);

    useEffect(() => {
        if (isEditing) {
            setEditingText(value);
        }
    }, [isEditing, value, setEditingText]);

    const handleConfirm = () => {
        if (onChange) {
            onChange(editingText);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditingText(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleConfirm();
        else if (e.key === 'Escape') handleCancel();
    };

    if (isEditing) {
        return (
            <Row
                spacing={1}
                className={className}>
                <Input
                    value={editingText}
                    autoFocus
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Row spacing={1}>
                    <IconButton
                        aria-label="Confirm edit"
                        onClick={handleConfirm}>
                        <Save />
                    </IconButton>
                    <IconButton
                        aria-label="Cancel edit"
                        onClick={handleCancel}>
                        <Close />
                    </IconButton>
                </Row>
            </Row>
        );
    } else {
        return (
            <Row
                role="button"
                className={cx('uitw-group uitw-py-1 uitw-cursor-pointer', className)}
                spacing={1}
                onClick={() => setIsEditing(true)}
            >
                <Typography>{value}</Typography>
                <span className="uitw-invisible group-hover:uitw-visible"><Edit size={16} /></span>
            </Row>
        )
    }
}
