import { NavigatingButton } from "@signalco/ui/NavigatingButton";
import { Meta, StoryObj } from "@storybook/react";

const Component = NavigatingButton;

export default {
    component: Component,
    tags: ['autodocs'],
    args: {
        children: 'Navigate',
        href: '#'
    }
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Component>;

export const Default: Story = {};