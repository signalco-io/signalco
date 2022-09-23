import { useTheme } from '@mui/material';
import { Box } from '@mui/system';

export default function DotIndicator(props: { color: 'success' | 'warning' | 'error' | 'grey', content?: React.ReactElement, size?: number }) {
    const { color, content, size: requestedSize } = props;
    const theme = useTheme();
    const colorPalette = color === 'grey' ? theme.palette.grey[400] : theme.palette[color].main;
    const size = requestedSize || 10;
    return (
        <Box sx={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colorPalette, color: 'white' }}>
            {content}
        </Box>
    )
}
