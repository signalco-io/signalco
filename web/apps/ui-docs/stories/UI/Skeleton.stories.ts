import { Skeleton } from "@signalco/ui-primitives/Skeleton";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
    component: Skeleton,
    tags: ['autodocs'],
    args: {
        style: {
            width: '250px',
            height: '32px'
        }
    }
} satisfies Meta<typeof Skeleton>;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};