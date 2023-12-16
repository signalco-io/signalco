import { EditableInput } from "@signalco/ui/EditableInput";
import { StoryObj } from "@storybook/react";

export default { component: EditableInput, tags: ['autodocs'] };
type Story = StoryObj<typeof EditableInput>;

export const Default: Story = {
    args: {
        value: 'Editable input'
    }
};