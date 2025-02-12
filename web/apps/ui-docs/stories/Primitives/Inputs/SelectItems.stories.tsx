import { SelectItems } from "@signalco/ui-primitives/SelectItems";
import { Meta, StoryObj } from "@storybook/react";

export default {
    component: SelectItems,
    tags: ['autodocs']
} satisfies Meta<typeof SelectItems>;
type Story = StoryObj<typeof SelectItems>;

export const Default: Story = {
    args: {
        defaultValue: "1",
        label: 'Select an option',
        placeholder: "Please select an option...",
        helperText: "This is a helper text",
        items: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
        ]
    }
};

export const Narrow: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Narrow select with long content to test for line clamping, overflow, ellipsis and text alignment.'
            }
        }
    },
    args: {
        defaultValue: "1",
        className: 'w-32',
        items: [
            { label: 'Option 1 for user user.name@example.com', value: '1' },
            { label: 'Option 2 for user user2.name@example.com', value: '2' },
            { label: 'Option 3 for user both user.name@example.com, user2.name@example.com, user3.name@example.com, user4.name@example.com, user5.name@example.com and user6.name@example.com', value: '3' },
        ]
    }
};

export const Scroll: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Select with scroll buttons.'
            }
        }
    },
    args: {
        defaultValue: "1",
        items: Array.from({ length: 100 }, (_, i) => ({ label: `Option ${i + 1}`, value: `${i + 1}` }))
    }
};