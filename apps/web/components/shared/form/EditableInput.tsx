import React, { useEffect, useState } from 'react';
import { Close, Save, Edit } from '@signalco/ui-icons';
import { Stack, SystemStyleObject } from '@mui/system';
import { Box, IconButton, Input, Theme, Typography } from '@mui/joy';

interface IEditableInputProps {
    text: string,
    onChange: (text: string) => void
    sx?: SystemStyleObject<Theme>
    sxInput?: SystemStyleObject<Theme>,
    noWrap?: boolean
}

function EditableInput(props: IEditableInputProps) {
    const {
        text,
        sx,
        sxInput,
        onChange,
        noWrap
    } = props;

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
            <Stack direction="row" spacing={1}>
                <Input
                    sx={{
                        '& input': {
                            ...(sxInput || sx)
                        }
                    }}
                    value={editingText}
                    autoFocus
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Stack spacing={1} direction="row">
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
                </Stack>
            </Stack>
        );
    } else {
        return (
            <Box sx={{ py: '4px', cursor: 'pointer' }} onClick={() => setIsEditing(true)}>
                <Typography sx={{
                    '& > .editIndicator': { visibility: 'hidden' },
                    '&:hover': { '& > .editIndicator': { visibility: 'visible' } },
                    ...sx
                }} noWrap={noWrap}>{text}<span className="editIndicator"><Edit /></span></Typography>
            </Box>
        )
    }
}

export default EditableInput;
