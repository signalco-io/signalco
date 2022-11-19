import { Box, SxProps, Theme } from '@mui/system';
import { ChildrenProps } from '../sharedTypes';

export interface IconProps extends ChildrenProps {
    sx?: SxProps<Theme>;
}

export default function Icon(props: IconProps) {
    return (
        <Box
            component="span"
            className="material-icons"
            sx={{
                ...props.sx
            }}>
            {props.children}
        </Box>
    );
}
