import { Typography } from "@signalco/ui-primitives/Typography";
import { Accordion } from "@signalco/ui/Accordion";
import { Meta, StoryObj } from "@storybook/react";

export default { component: Accordion, tags: ['autodocs'] } satisfies Meta<typeof Accordion>;
type Story = StoryObj<typeof Accordion>;

const Template: Story = {
    render: (args) => (
        <Accordion {...args}>
            <Typography level="h6">Title</Typography>
            <p>Mollit duis ad excepteur consequat eiusmod consequat mollit cillum commodo.</p>
        </Accordion>
    )
}

export const Default: Story = { ...Template };

export const Plain: Story = {
    args: { variant: 'plain' },
    ...Template
}