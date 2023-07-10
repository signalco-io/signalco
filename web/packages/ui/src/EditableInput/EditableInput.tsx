import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import { Close, Save, Edit } from '@signalco/ui-icons';
import { IconButton } from '../IconButton';
import { Typography } from '../Typography';
import { Row } from '../Row';
import { cx } from 'classix';
import { Input } from '../Input';

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
                className={cx("group py-1 cursor-pointer", className)}
                spacing={1}
                onClick={() => setIsEditing(true)}
            >
                <Typography>{value}</Typography>
                <span className="editIndicator invisible group-hover:visible"><Edit size={16} /></span>
            </Row>
        )
    }
}
