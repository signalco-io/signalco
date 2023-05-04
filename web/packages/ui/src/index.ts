import './main.css';

export { useColorScheme } from '@mui/joy/styles';

export type DefaultColorScheme = 'light' | 'dark';
export type SupportedColorScheme = DefaultColorScheme;
export type ColorPaletteProp = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
export type { ColorVariants } from './sharedTypes';
