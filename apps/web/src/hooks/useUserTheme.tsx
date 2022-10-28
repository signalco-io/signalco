import { useColorScheme } from '@mui/joy/styles';

export default function useUserTheme() {
    const { colorScheme } = useColorScheme();
    return {
        theme: colorScheme,
        isDark: colorScheme === 'dark'
    };
}
