import { SelectItems } from "@signalco/ui-primitives/SelectItems";
import { Meta, StoryObj } from "@storybook/react";

export default { 
    component: SelectItems, 
    tags: ['autodocs'],
    args: {
        items: [
            { value: '1', label: 'Item 1' },
        ],
        label: 'Select',
        placeholder: 'Select an item...',
        helperText: 'Please select an item',
    }
} satisfies Meta<typeof SelectItems>;
type Story = StoryObj<typeof SelectItems>;

const Template: Story = {
    render: (args) => (
        <SelectItems {...args} />
    )
}

export const Default: Story = { ...Template };