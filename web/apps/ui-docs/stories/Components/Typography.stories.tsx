import { Typography } from "@signalco/ui/dist/Typography";
import { Meta, StoryObj } from "@storybook/react";

export default { component: Typography, tags: ['autodocs'] } satisfies Meta<typeof Typography>;
type Story = StoryObj<typeof Typography>;

const Template: Story = {
    render: (args) => (
        <Typography {...args} />
    )
}

export const Default: Story = { ...Template };