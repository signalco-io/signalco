import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function useIsTablet() {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('md'));
}
