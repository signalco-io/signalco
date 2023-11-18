import { useState } from 'react';
import { cx } from 'classix';
import { Edit } from '@signalco/ui-icons';
import { Typography, TypographyProps, populateTypographyStylesAndClasses } from '../Typography/Typography';

export type TypographyEditableProps = Omit<TypographyProps, 'onChange' | 'children'> & {
    children: string | null | undefined;
    onEditingChanged?: (editing: boolean) => void;
    onChange?: (text: string) => void;
    hideEditIcon?: boolean;
    multiple?: boolean;
};

export function TypographyEditable({ children, className, onChange, onEditingChanged, placeholder, hideEditIcon, multiple, ...rest }: TypographyEditableProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState('');

    const handleEdit = () => {
        setValue(children ?? '');
        setIsEditing(true);
        onEditingChanged?.(true);
    }

    const handleConfirm = () => {
        onChange?.(value);
        setIsEditing(false);
        onEditingChanged?.(false);
    }

    const handleCancel = () => {
        setIsEditing(false);
        onEditingChanged?.(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleConfirm();
        else if (e.key === 'Escape') handleCancel();
    };

    if (isEditing) {
        const { className: inputClassName, ...typographyStyles } = populateTypographyStylesAndClasses({ className, ...rest });
        return (
            <input
                value={value}
                autoFocus
                className={cx('uitw-bg-transparent', inputClassName)}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleConfirm}
                onKeyDown={handleKeyDown}
                multiple={multiple}
                {...typographyStyles} />
        )
    }

    return (
        <Typography
            className={cx('uitw-group uitw-cursor-pointer [word-break:break-word]', !children && 'uitw-text-muted-foreground', className)}
            role="button"
            onClick={handleEdit}
            {...rest}>
            {children || placeholder}
            {!hideEditIcon && (
                <Edit size={20} className="uitw-ml-2 uitw-inline uitw-opacity-0 uitw-transition-opacity group-hover:uitw-opacity-60" />
            )}
        </Typography>
    );
}
