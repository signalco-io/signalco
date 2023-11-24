import { Loadable } from "@signalco/ui/Loadable";
import { StoryObj } from "@storybook/react";

export default { component: Loadable, tags: ['autodocs'], args: { isLoading: true, loadingLabel: 'Loading...' } };
type Story = StoryObj<typeof Loadable>;

export const Default: Story = {};

export const PlaceholderSkeletonText: Story = {
    args: {
        placeholder: 'skeletonText',
        ...Default.args
    }
};

export const PlaceholderSkeletonRect: Story = {
    args: {
        placeholder: 'skeletonRect',
        ...Default.args
    }
};

export const PlaceholderCircular: Story = {
    args: {
        placeholder: 'circular',
        ...Default.args
    }
};

export const PlaceholderCustom: Story = {
    args: {
        placeholder: 'Custom loading...',
        ...Default.args
    }
};