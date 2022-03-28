import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Button, Stack, Table, Typography } from '@mui/material';
import { camelToSentenceCase } from '../../src/helpers/StringHelpers';
import { Box } from '@mui/system';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button
} as ComponentMeta<typeof Button>;

type Variant = undefined | 'text' | 'outlined' | 'contained';
type VariantWithDefault = Variant | 'default';

type Size = undefined | 'small' | 'medium' | 'large';
type SizeWithDefault = Size | 'default';

type Color = undefined | 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
type ColorWithDefault = Color | 'default';

const variants: VariantWithDefault[] = ['default', 'text', 'outlined', 'contained'];
const sizes: SizeWithDefault[] = ['default', 'small', 'medium', 'large'];
const colors: ColorWithDefault[] = ['default', 'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];

const Size = (props: { variant: Variant, size: Size }) => (
  <Stack>
    {colors.map(color => (
      <Button key={`${props.variant}-${props.size}-${color}`}
        variant={props.variant}
        size={props.size}
        color={color === 'default' ? undefined : color}>
        {camelToSentenceCase(`${color} ${props.variant} (${props.size ?? 'default'})` ?? 'default')}
      </Button>
    ))}
  </Stack>
);

const Variant = ({ variant }: { variant: Variant }) => (
  <Stack spacing={1}>
    <div>
      <Typography textAlign="center">{camelToSentenceCase(variant ?? 'default')}</Typography>
    </div>
    <Stack direction="column" spacing={4}>
      {sizes.map(size => (
        <Size key={`${variant}-${size}`} variant={variant} size={size === 'default' ? undefined : size} />
      ))}
    </Stack>
  </Stack>
)

export const Matrix = () => (
  <Stack direction="row" spacing={1}>
    {variants.map(variant => (
      <Variant key={variant} variant={variant === 'default' ? undefined : variant} />
    ))}
  </Stack>
);
