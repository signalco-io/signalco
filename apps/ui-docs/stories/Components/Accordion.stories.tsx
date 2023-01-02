import { Accordion } from "@signalco/ui";
import { Meta, StoryObj } from "@storybook/react";

export default { component: Accordion, tags: ['docsPage'] } satisfies Meta<typeof Accordion>;
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