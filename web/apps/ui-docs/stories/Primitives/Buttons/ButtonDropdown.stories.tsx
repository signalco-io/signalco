import { ButtonDropdown } from "@signalco/ui-primitives/ButtonDropdown";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
    component: ButtonDropdown,
    tags: ['autodocs'],
    args: {
        children: 'Select an option'
    }
} satisfies Meta<typeof ButtonDropdown>;
type Story = StoryObj<typeof ButtonDropdown>;

export const Default: Story = {};

export const Loading: Story = {
    args: { loading: true }
};

export const FullWidth: Story = {
    args: { fullWidth: true }
};

export const WithStartDecorator: Story = {
    args: { startDecorator: '🚀' }
};

export const Disabled: Story = {
    args: { disabled: true }
};
