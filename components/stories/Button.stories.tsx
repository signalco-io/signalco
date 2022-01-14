import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '@mui/material';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['text', 'outlined', 'contained']
    },
    color: {
      control: { type: 'select' },
      options: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning']
    }
  }
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const PrimaryText = Template.bind({});
PrimaryText.args = {
  children: 'Button',
};

export const SecondaryText = Template.bind({});
SecondaryText.args = {
  children: 'Button',
  color: 'secondary'
};

export const PrimaryOutlined = Template.bind({});
PrimaryOutlined.args = {
  color: "primary",
  children: 'Button',
  variant: 'outlined'
};

export const SecondaryOutlined = Template.bind({});
SecondaryOutlined.args = {
  children: 'Button',
  color: 'secondary',
  variant: 'outlined'
};

export const PrimaryContained = Template.bind({});
PrimaryContained.args = {
  color: "primary",
  children: 'Button',
  variant: 'contained'
};

export const SecondaryContained = Template.bind({});
SecondaryContained.args = {
  children: 'Button',
  color: 'secondary',
  variant: 'contained'
};

export const ErrorContained = Template.bind({});
ErrorContained.args = {
  children: 'Button',
  color: 'error',
  variant: 'contained'
};

export const WarningContained = Template.bind({});
WarningContained.args = {
  children: 'Button',
  color: 'warning',
  variant: 'contained'
};

export const SuccessContained = Template.bind({});
SuccessContained.args = {
  children: 'Button',
  color: 'success',
  variant: 'contained'
};

export const InfoContained = Template.bind({});
InfoContained.args = {
  children: 'Button',
  color: 'info',
  variant: 'contained'
};

export const Large = Template.bind({});
Large.args = {
  ...PrimaryOutlined.args,
  size: 'large',
};

export const Small = Template.bind({});
Small.args = {
  ...PrimaryOutlined.args,
  size: 'small',
};
