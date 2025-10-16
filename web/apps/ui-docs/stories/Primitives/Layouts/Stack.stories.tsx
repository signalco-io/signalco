import { Stack } from "@signalco/ui-primitives/Stack";
import { StoryObj } from "@storybook/nextjs";

export default {
    component: Stack,
    tags: ['autodocs'],
    args: {
        children: [
            <span>First</span>,
            <span>Second</span>,
            <span>Third</span>
        ]
    }
};
type Story = StoryObj<typeof Stack>;

export const Default: Story = {};