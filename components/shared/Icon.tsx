import { Box, SxProps, Theme } from '@mui/system';
import { ChildrenProps } from 'src/sharedTypes';

export interface IconProps extends ChildrenProps {
    sx?: SxProps<Theme>;
}

export default function Icon(props: IconProps) {
    return (
        <Box component="span" sx={props.sx}>{props.children}</Box>
    );
}
