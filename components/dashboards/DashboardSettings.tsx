import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DashboardsRepository, { IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import ConfigurationDialog from "../shared/dialog/ConfigurationDialog";
import ConfirmDeleteButton from "../shared/dialog/ConfirmDeleteButton";

interface IDashboardSettingsProps {
    isOpen: boolean,
    dashboard?: IDashboardModel,
    onClose: () => void,
}

const DashboardSettings = (props: IDashboardSettingsProps) => {
    const { isOpen, dashboard, onClose } = props;
    const router = useRouter();
    const [name, setName] = useState(dashboard?.name || '');

    const handleSave = async () => {
        await DashboardsRepository.saveDashboardAsync(
            {
                ...dashboard,
                name: name
            }
        );
        onClose();
    }

    const handleDashboardDelete = async () => {
        if (dashboard) {
            await DashboardsRepository.deleteDashboardAsync(dashboard?.id);
            router.push({ hash: undefined });
        }
        onClose();
    }

    useEffect(() => {
        if (dashboard) {
            setName(dashboard.name);
        }
    }, [dashboard]);

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
                        expectedConfirmText={name || 'confirm'}
                        onConfirm={handleDashboardDelete} />
                </Stack>
            </Stack>
        </ConfigurationDialog>
    );
};

export default DashboardSettings;