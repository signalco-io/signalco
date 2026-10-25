import { Input } from "@signalco/ui-primitives/Input";
import { StoryObj } from "@storybook/nextjs";
import { Comment, Send } from '@signalco/ui-icons';
import { IconButton } from "@signalco/ui-primitives/IconButton";
import { Stack } from "@signalco/ui-primitives/Stack";
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
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

export const ControlledDecorators: Story = {
    render: function ControlledDecorators() {
        const [value, setValue] = useState('');

        return (
            <Input
                aria-label="Message"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                startDecorator={<Comment className="ml-2 text-secondary-foreground" />}
                endDecorator={<IconButton title="Send" variant="plain"><Send /></IconButton>}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('textbox', { name: 'Message' });

        await userEvent.click(input);
        for (const character of 'Hello') {
            await userEvent.keyboard(character);
            await expect(canvas.getByRole('textbox', { name: 'Message' })).toBe(input);
            await expect(input).toHaveFocus();
        }
        await expect(input).toHaveValue('Hello');

        await userEvent.keyboard('{ArrowLeft}{ArrowLeft}p');
        await expect(input).toHaveValue('Helplo');
        await expect(input).toHaveFocus();
    }
};

export const ControlledDetails: Story = {
    render: function ControlledDetails() {
        const [value, setValue] = useState('');

        return (
            <Input
                label={`Message (${value.length})`}
                helperText={`${value.length} characters`}
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('textbox', { name: 'Message (0)' });

        await userEvent.click(input);
        for (const character of 'Hello') {
            await userEvent.keyboard(character);
            await expect(canvas.getByRole('textbox')).toBe(input);
            await expect(input).toHaveFocus();
        }
        await expect(input).toHaveValue('Hello');
        await expect(input).toHaveAccessibleName('Message (5)');
        await expect(canvas.getByText('5 characters')).toBeVisible();
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
