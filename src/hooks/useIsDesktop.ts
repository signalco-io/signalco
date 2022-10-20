import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function useIsDesktop() {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up('lg'));
}
