import { SelectItems } from "@signalco/ui-primitives/SelectItems";
import { Meta, StoryObj } from "@storybook/react";

export default { 
    component: SelectItems, 
    tags: ['autodocs'],
    args: {
        items: []
    }
} satisfies Meta<typeof SelectItems>;
type Story = StoryObj<typeof SelectItems>;

const Template: Story = {
    render: (args) => (
        <SelectItems {...args} />
    )
}

export const Default: Story = { ...Template };