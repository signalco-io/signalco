import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function useIsLaptop() {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.between('md', 'lg'));
}
