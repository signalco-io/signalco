import { useColorScheme } from '@signalco/ui';

export default function useUserTheme() {
    const { colorScheme } = useColorScheme();
    return {
        theme: colorScheme,
        isDark: colorScheme === 'dark'
    };
}
