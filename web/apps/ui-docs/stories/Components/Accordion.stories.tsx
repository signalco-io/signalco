import { Accordion } from "@signalco/ui/Accordion";
import { Meta, StoryObj } from "@storybook/react";

export default { component: Accordion, tags: ['autodocs'] } satisfies Meta<typeof Accordion>;
type Story = StoryObj<typeof Accordion>;

const Template: Story = {
    render: (args) => (
        <Accordion {...args}>
            <h3>Title</h3>
            <p>Mollit duis ad excepteur consequat eiusmod consequat mollit cillum commodo.</p>
        </Accordion>
    )
}

export const Default: Story = { ...Template };