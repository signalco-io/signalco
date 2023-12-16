import { Input } from "@signalco/ui-primitives/Input";
import { StoryObj } from "@storybook/react";

export default { component: Input, tags: ['autodocs'] };
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        value: 'Value',
        helperText: 'Helper text',
    }
};