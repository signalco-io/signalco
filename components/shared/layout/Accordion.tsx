import { Box, SxProps, Theme } from '@mui/system';
import { ChildrenProps } from 'src/sharedTypes';

export interface AccordionProps extends ChildrenProps {
    open?: boolean;
    disabled?: boolean;
    sx?: SxProps<Theme>;
    onChange?: (e: unknown, expanded: boolean) => void
}

export default function Accordion(props: AccordionProps) {
    const { children, open, sx } = props;
    return (
        <Box sx={sx}>
            {!!children && Array.isArray(children) ? children[0] : children}
            {open && !!children && Array.isArray(children) && children.filter((_, i) => i !== 0)}
        </Box>
    )
}
