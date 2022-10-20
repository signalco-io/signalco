import { Box, SxProps, Theme } from '@mui/system';
import { ChildrenProps } from 'src/sharedTypes';

export interface AccordionProps extends ChildrenProps {
    open?: boolean;
    disabled?: boolean;
    sx?: SxProps<Theme>;
    onChange?: () => void
}

export default function Accordion(props: AccordionProps) {
    const { children, sx } = props;
    return (
        <Box sx={sx}>
            {children}
        </Box>
    )
}
