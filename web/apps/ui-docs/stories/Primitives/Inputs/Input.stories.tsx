import { Input } from "@signalco/ui-primitives/Input";
import { StoryObj } from "@storybook/react";
import { Comment, Send } from '@signalco/ui-icons';
import { IconButton } from "@signalco/ui-primitives/IconButton";
import { Stack } from "@signalco/ui-primitives/Stack";
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
        endDecorator: <IconButton title="Send" variant="plain"><Send /></IconButton>,
    }
};

export const Plain: Story = {
    args: {
        placeholder: 'Message...',
        variant: 'plain',
    }
};

export const Soft: Story = {
    args: {
        placeholder: 'Message...',
        variant: 'soft',
    }
};

// Render example form
export const Form: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter your username',
        helperText: 'Must be unique',
    },
    render: ({ label, placeholder, helperText }) => (
        <Stack spacing={2}>
            <Input label={label} placeholder={placeholder} helperText={helperText} />
            <Input label="Password" placeholder="Enter your password" type="password" />
            <Input label="Repeat password" placeholder="Enter your password again" type="password" />
        </Stack>
    )
};