import { Close, Edit, Save } from '@mui/icons-material';
import { Theme, Typography, Box, Input, InputAdornment, IconButton } from '@mui/material';
import { SystemStyleObject } from '@mui/system';
import React, { useEffect, useState } from 'react';

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

    return (
        isEditing
            ? <Input
                sx={{
                    '& input': {
                        ...(sxInput || sx)
                    }
                }}
                value={editingText}
                autoFocus
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={handleKeyDown}
                endAdornment={
                    <InputAdornment position="end">
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
                    </InputAdornment>
                }
            />
            : <Box sx={{ py: '4px', cursor: 'pointer' }} onClick={() => setIsEditing(true)}>
                <Typography sx={{
                    '& > .editIndicator': { visibility: 'hidden' },
                    '&:hover': { '& > .editIndicator': { visibility: 'visible' } },
                    ...sx
                }} noWrap={noWrap}>{text}<span className="editIndicator"><Edit sx={{ ml: 1, verticalAlign: 'middle' }} /></span></Typography>
            </Box>
    );
}

export default EditableInput;
