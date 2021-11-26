import { Button, FormGroup, TextField } from "@mui/material";
import React, { useState } from "react";
import ConfigurationDialog from "../shared/dialog/ConfigurationDialog";
import { IDashboard } from "./Dashboards";

interface IDashboardSettingsProps {
    isOpen: boolean,
    dashboard: IDashboard,
    onClose: () => void,
    onChange: (dashboard: IDashboard) => void
}

const DashboardSettings = (props: IDashboardSettingsProps) => {
    const { isOpen, dashboard, onClose, onChange } = props;
    const [name, setName] = useState(dashboard?.name || '');

    const handleSave = () => {
        onChange({
            ...dashboard,
            name: name
        });
    }

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
            <FormGroup>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value || "")} />
            </FormGroup>
        </ConfigurationDialog>
    );
};

export default DashboardSettings;