import { Container, FormControlLabel, FormGroup, Paper, Switch } from '@mui/material';
import React, { useState } from 'react';
import AppLayout from "../../../components/AppLayout";

const SettingsIndex = () => {
    const [isDarkMode, setIsDarkMode] = useState((typeof window !== 'undefined' && window.localStorage?.getItem('theme') === 'dark') ? true : false);

    const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isDark = event?.target.checked;
        window.localStorage.setItem("theme", isDark ? "dark" : "light");
        setIsDarkMode(isDark);
        window.location.reload();
    };

    return (
        <Container>
            <Paper>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDarkMode}
                                onChange={handleDarkModeChange}
                                inputProps={{ 'aria-label': 'Dark mode switch' }} />}
                        label="Dark mode" />
                </FormGroup>
            </Paper>
        </Container>
    );
};

SettingsIndex.layout = AppLayout;

export default SettingsIndex;