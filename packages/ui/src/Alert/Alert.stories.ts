import type { Meta, StoryObj } from '@storybook/react';
import Alert from '.';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['docsPage'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Primary: Story = {
  args: {
    children: 'Primary alert',
    color: 'primary'
  },
};

export const Success: Story = {
  args: {
    children: 'Success alert',
    color: 'success',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger alert',
    color: 'danger',
  },
};
