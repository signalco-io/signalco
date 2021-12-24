import { Container, FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import { AppContext } from '../../_app';

const SettingsIndex = () => {
    const appContext = useContext(AppContext);
    const isDarkMode = appContext.theme === 'dark';

    const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newIsDarkMode = event?.target.checked;
        if (appContext.setTheme)
            appContext.setTheme(newIsDarkMode ? "dark" : 'light');
    };

    return (
        <Container sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h2" sx={{ pt: { mobile: 0, tablet: 2 } }}>Look and feel</Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDarkMode}
                                onChange={handleDarkModeChange}
                                inputProps={{ 'aria-label': 'Dark mode switch' }} />}
                        label="Dark mode" />
                </FormGroup>
            </Stack>
        </Container>
    );
};

SettingsIndex.layout = AppLayoutWithAuth;

export default SettingsIndex;