import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { DefaultColorPalette, DefaultVariantProp } from '@mui/joy/styles/types';
import { Button, Stack, Typography } from '@mui/joy';
import { camelToSentenceCase } from '../../src/helpers/StringHelpers';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button
} as ComponentMeta<typeof Button>;

type Variant = undefined | DefaultVariantProp;
type VariantWithDefault = Variant | 'default';

type Size = undefined | 'sm' | 'md' | 'lg';
type SizeWithDefault = Size | 'default';

type Color = undefined | DefaultColorPalette;
type ColorWithDefault = Color | 'default';

const variants: VariantWithDefault[] = ['default', 'plain', 'soft', 'outlined', 'solid'];
const sizes: SizeWithDefault[] = ['default', 'sm', 'md', 'lg'];
const colors: ColorWithDefault[] = ['default', 'primary', 'neutral', 'success', 'danger', 'info', 'warning'];

function Size(props: { variant: Variant, size: Size }) {
  return <Stack>
    {colors.map(color => (
      <Button key={`${props.variant}-${props.size}-${color}`}
        variant={props.variant}
        size={props.size}
        color={color === 'default' ? undefined : color}>
        {camelToSentenceCase(`${color} ${props.variant} (${props.size ?? 'default'})` ?? 'default')}
      </Button>
    ))}
  </Stack>
}

function Variant({ variant }: { variant: Variant }) {
  return <Stack spacing={1}>
    <div>
      <Typography textAlign="center">{camelToSentenceCase(variant ?? 'default')}</Typography>
    </div>
    <Stack direction="column" spacing={4}>
      {sizes.map(size => (
        <Size key={`${variant}-${size}`} variant={variant} size={size === 'default' ? undefined : size} />
      ))}
    </Stack>
  </Stack>
}

export function Matrix() {
  return <Stack direction="row" spacing={1}>
    {variants.map(variant => (
      <Variant key={variant} variant={variant === 'default' ? undefined : variant} />
    ))}
  </Stack>
}
