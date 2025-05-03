import { IconButtonCopyToClipboard } from "@signalco/ui/IconButtonCopyToClipboard";
import { StoryObj } from "@storybook/react";

export default {
    component: IconButtonCopyToClipboard,
    tags: ['autodocs'],
    args: {
        title: 'Copy to clipboard',
        value: 'Hello, World!',
        successMessage: 'Copied to clipboard',
        errorMessage: 'Failed to copy to clipboard',
    },
};
type Story = StoryObj<typeof IconButtonCopyToClipboard>;

export const Default: Story = {};