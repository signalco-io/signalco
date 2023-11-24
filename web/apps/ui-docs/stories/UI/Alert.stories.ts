import type { StoryObj } from '@storybook/react';
import { Alert } from '@signalco/ui/Alert';

export default { component: Alert, tags: ['autodocs'] };

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
