import { Chip } from "@signalco/ui-primitives/Chip";
import { Meta, StoryObj } from "@storybook/react";

export default {
    component: Chip, tags: ['autodocs'],
    args: { 
        children: 'Chip',
        color: 'neutral',
        size: 'md',
    },
    argTypes: {
        children: { control: 'text' },
        color: { control: 'select', options: ['primary', 'secondary', 'neutral', 'info', 'success', 'warning', 'error'] },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Chip>;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const Primary: Story = { args: { color: 'primary' } };

export const Secondary: Story = { args: { color: 'secondary' } };

export const Neutral: Story = { args: { color: 'neutral' } };

export const Info: Story = { args: { color: 'info' } };

export const Success: Story = { args: { color: 'success' } };

export const Warning: Story = { args: { color: 'warning' } };

export const Error: Story = { args: { color: 'error' } };