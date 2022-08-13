import { useTheme } from '@mui/material';
import { Box } from '@mui/system';

export default function DotIndicator(props: { color: 'success' | 'warning' | 'error' }) {
    const { color } = props;
    const theme = useTheme();
    const colorPalette = theme.palette[color].main;
    const size = 12;
    return (
        <Box sx={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colorPalette }} />
    )
}
