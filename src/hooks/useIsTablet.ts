import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function useIsTablet() {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('md'));
}
