import React, { useEffect, useState } from 'react';
import { Close, Save, Edit } from '@signalco/ui-icons';
import { Input } from '@mui/joy';
import { IconButton } from '../IconButton';
import { Typography } from '../Typography';
import { Row } from '../Row';

export type EditableInputProps = {
    text: string,
    onChange: (text: string) => void
    noWrap?: boolean
    className?: string;
}

export function EditableInput({
    text,
    onChange,
    noWrap,
    className
}: EditableInputProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState(text);
    useEffect(() => {
        if (isEditing)
            setEditingText(text);
    }, [isEditing, text, setEditingText])

    const handleConfirm = () => {
        onChange(editingText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditingText(text);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleConfirm();
        else if (e.key === 'Escape') handleCancel();
    };

    if (isEditing) {
        return (
            <Row spacing={1} className={className}>
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
            <div className="py-1 cursor-pointer" onClick={() => setIsEditing(true)}>
                <Typography className="group" noWrap={noWrap}>
                    {text}
                    <span className="editIndicator invisible group-hover:visible"><Edit /></span>
                </Typography>
            </div>
        )
    }
}
