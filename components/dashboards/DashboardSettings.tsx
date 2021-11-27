import { Breakpoint, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfigurationDialog from "../shared/dialog/ConfigurationDialog";
import { IDashboard } from "./Dashboards";

interface IDashboardSettingsProps {
    isOpen: boolean,
    dashboard: IDashboard,
    onClose: () => void,
    onChange: (dashboard: IDashboard) => void,
    onDeleteConfirmed: () => void
}

interface IConfirmDeleteDialogProps {
    isOpen: boolean,
    title: React.ReactNode,
    expectedConfirmText: string,
    onClose: () => void,
    onConfirm: () => void,
    maxWidth?: false | undefined | Breakpoint,
}

interface IConfirmDeleteButtonDialogProps {
    title: React.ReactNode,
    expectedConfirmText: string,
    onConfirm: () => void,
    maxWidth?: false | undefined | Breakpoint,
}

interface IConfirmDeleteButtonProps extends IConfirmDeleteButtonDialogProps {
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

const ConfirmDeleteDialog = (props: IConfirmDeleteDialogProps) => {
    const { isOpen, title, expectedConfirmText, onClose, onConfirm, maxWidth } = props;
    const [confirmText, setConfirmText] = useState('');

    return (
        <ConfigurationDialog
            title={title}
            isOpen={isOpen}
            onClose={onClose}
            maxWidth={maxWidth}>
            <Stack spacing={4}>
                <Typography>Deleted item can not be restored. Please confirm you are deleting correct item by entering &quot;<code>{expectedConfirmText}</code>&quot; bellow.</Typography>
                <TextField label="Confirm" onChange={(e) => setConfirmText(e.target.value)} />
                <Button variant="contained" color="error" disabled={confirmText !== expectedConfirmText} onClick={onConfirm}>
                    Delete &quot;{confirmText}&quot;
                </Button>
            </Stack>
        </ConfigurationDialog>
    );
};

const DashboardSettings = (props: IDashboardSettingsProps) => {
    const { isOpen, dashboard, onClose, onChange, onDeleteConfirmed } = props;
    const [name, setName] = useState(dashboard?.name || '');

    const handleSave = () => {
        onChange({
            ...dashboard,
            name: name
        });
    }

    useEffect(() => {
        if (dashboard) {
            setName(dashboard.name);
        }
    }, [dashboard])

    return (
        <ConfigurationDialog
            isOpen={isOpen}
            title={`Dashboard settings`}
            onClose={onClose}
            actions={(
                <>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button autoFocus onClick={handleSave}>Save changes</Button>
                </>
            )}>
            <Stack spacing={4} sx={{ py: 1 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value || "")} />
                <Stack spacing={2}>
                    <Typography sx={{ opacity: 0.6 }} variant="subtitle2">Advanced</Typography>
                    <ConfirmDeleteButton
                        buttonLabel="Delete dashboard..."
                        title="Delete dashboard"
                        expectedConfirmText={name}
                        onConfirm={onDeleteConfirmed} />
                </Stack>
            </Stack>
        </ConfigurationDialog>
    );
};

export default DashboardSettings;