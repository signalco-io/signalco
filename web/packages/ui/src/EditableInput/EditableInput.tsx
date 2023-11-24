import React, { useEffect, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Close, Save, Edit } from '@signalco/ui-icons';

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
                className={cx('group py-1 cursor-pointer', className)}
                spacing={1}
                onClick={() => setIsEditing(true)}
            >
                <Typography>{value}</Typography>
                <span className="invisible group-hover:visible"><Edit size={16} /></span>
            </Row>
        )
    }
}
