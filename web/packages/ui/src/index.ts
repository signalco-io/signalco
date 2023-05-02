import './main.css';

export { Box } from '@mui/system';
export { 
    Avatar, 
    Badge,
    Divider, 
    Card,
    CardOverflow,
    CardCover,
    CardContent,
    Checkbox as JoyCheckbox, // TODO: Remove
    CircularProgress,
    FormControl,
    FormLabel,
    Grid,
    IconButton, 
    Input,
    Link as JoyLink, // TODO: Remove
    List,
    ListItem,
    ListItemButton,
    ListItemContent, 
    ListItemDecorator, 
    ListDivider,
    Modal, 
    ModalClose, 
    ModalDialog,
    Option,
    Radio,
    RadioGroup,
    Select,
    selectClasses,
    Slider,
    Sheet, 
    Switch,
    Tooltip
} from "@mui/joy";

export { CssBaseline } from '@mui/joy';
export { Stack as MuiStack } from '@mui/system';
export { useColorScheme, CssVarsProvider, getInitColorSchemeScript, extendTheme } from '@mui/joy/styles';

// TODO: Remove as we should use direct joy types
export type { DefaultColorScheme } from '@mui/joy/styles/types';
export type { ButtonProps, ColorPaletteProp, SupportedColorScheme, Theme } from '@mui/joy';
export type { SxProps, Breakpoint, SystemStyleObject } from '@mui/system';
export type { ChildrenProps, ColorVariants } from './sharedTypes';
