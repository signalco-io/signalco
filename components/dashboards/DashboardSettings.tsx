import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfigurationDialog from "../shared/dialog/ConfigurationDialog";
import ConfirmDeleteButton from "../shared/dialog/ConfirmDeleteButton";
import { IDashboard } from "./Dashboards";

interface IDashboardSettingsProps {
    isOpen: boolean,
    dashboard: IDashboard,
    onClose: () => void,
    onChange: (dashboard: IDashboard) => void,
    onDeleteConfirmed: () => void
}

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