import { Typography } from "@signalco/ui-primitives/Typography";
import { Accordion } from "@signalco/ui/Accordion";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Accordion> = {
    component: Accordion,
    tags: ['autodocs']
};

export default meta;

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