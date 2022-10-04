import { useColorScheme } from '@mui/material';

export default function useUserTheme() {
    const { colorScheme } = useColorScheme();
    return {
        theme: colorScheme,
        isDark: colorScheme === 'dark'
    };
}
