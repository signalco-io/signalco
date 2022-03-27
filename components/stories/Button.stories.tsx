import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Button, Stack } from '@mui/material';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button
} as ComponentMeta<typeof Button>;

export const Colors = (
  <Stack spacing={1}>
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="success">Success</Button>
    <Button color="error">Error</Button>
    <Button color="info">Info</Button>
    <Button color="warning">Warning</Button>
    <Button>Default</Button>
  </Stack>
);

export const Primary = (
  <Stack spacing={1}>
    <Button color="primary" variant="outlined">Button</Button>
  </Stack>
);

// export const PrimaryOutlined = Template.bind({});
// PrimaryOutlined.args = {
//   color: "primary",
//   children: 'Button',
//   variant: 'outlined'
// };

// export const SecondaryOutlined = Template.bind({});
// SecondaryOutlined.args = {
//   children: 'Button',
//   color: 'secondary',
//   variant: 'outlined'
// };

// export const PrimaryContained = Template.bind({});
// PrimaryContained.args = {
//   color: "primary",
//   children: 'Button',
//   variant: 'contained'
// };

// export const SecondaryContained = Template.bind({});
// SecondaryContained.args = {
//   children: 'Button',
//   color: 'secondary',
//   variant: 'contained'
// };

// export const ErrorContained = Template.bind({});
// ErrorContained.args = {
//   children: 'Button',
//   color: 'error',
//   variant: 'contained'
// };

// export const WarningContained = Template.bind({});
// WarningContained.args = {
//   children: 'Button',
//   color: 'warning',
//   variant: 'contained'
// };

// export const SuccessContained = Template.bind({});
// SuccessContained.args = {
//   children: 'Button',
//   color: 'success',
//   variant: 'contained'
// };

// export const InfoContained = Template.bind({});
// InfoContained.args = {
//   children: 'Button',
//   color: 'info',
//   variant: 'contained'
// };

// export const Large = Template.bind({});
// Large.args = {
//   ...PrimaryOutlined.args,
//   size: 'large',
// };

// export const Small = Template.bind({});
// Small.args = {
//   ...PrimaryOutlined.args,
//   size: 'small',
// };
