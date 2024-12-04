import { Input } from "@signalco/ui-primitives/Input";
import { StoryObj } from "@storybook/react";
import { Comment, Send } from '@signalco/ui-icons';
import { IconButton } from "@signalco/ui-primitives/IconButton";
export default { component: Input, tags: ['autodocs'] };
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        defaultValue: 'Value',
        helperText: 'Helper text',
    }
};

export const Decorators: Story = {
    args: {
        placeholder: 'Message...',
        startDecorator: <Comment className="ml-2 text-secondary-foreground" />,
        endDecorator: <IconButton variant="plain"><Send /></IconButton>,
    }
};