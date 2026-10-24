import { Bug, Device, Cloud } from "@signalco/ui-icons";
import { SelectItems } from "@signalco/ui-primitives/SelectItems";
import { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from 'storybook/test';
import { useState } from 'react';

export default {
    component: SelectItems,
    tags: ['autodocs']
} satisfies Meta<typeof SelectItems>;
type Story = StoryObj<typeof SelectItems>;

export const Default: Story = {
    args: {
        defaultValue: "2",
        onValueChange: fn(),
        label: 'Select an option',
        placeholder: "Please select an option...",
        helperText: "This is a helper text",
        items: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
        ]
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const trigger = canvas.getByRole('combobox');
        await expect(trigger).toHaveTextContent('Option 2');
        await expect(args.onValueChange).not.toHaveBeenCalled();
        await userEvent.click(trigger);
        const menu = within(canvasElement.ownerDocument.body);
        await expect(menu.getByRole('option', { name: 'Option 2' })).toHaveAttribute('data-state', 'checked');
        await userEvent.click(menu.getByRole('option', { name: 'Option 1' }));
        await expect(trigger).toHaveTextContent('Option 1');
        await expect(args.onValueChange).toHaveBeenLastCalledWith('1');
    }
};

export const Controlled: Story = {
    args: {
        ...Default.args,
        value: '1',
        defaultValue: '2',
    },
    render: function ControlledSelect(args) {
        const [value, setValue] = useState(args.value);
        return <SelectItems {...args} value={value} onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
        }} />;
    },
    play: async ({ canvasElement, args }) => {
        const trigger = within(canvasElement).getByRole('combobox');
        await expect(trigger).toHaveTextContent('Option 1');
        await userEvent.click(trigger);
        await userEvent.click(within(canvasElement.ownerDocument.body).getByRole('option', { name: 'Option 2' }));
        await expect(trigger).toHaveTextContent('Option 2');
        await expect(args.onValueChange).toHaveBeenLastCalledWith('2');
    }
};

export const InForm: Story = {
    args: {
        ...Default.args,
        name: 'selection',
    },
    render: (args) => <form><SelectItems {...args} /></form>,
    play: async (context) => {
        const form = context.canvasElement.querySelector('form')!;
        await expect(new FormData(form).get('selection')).toBe('2');
        await Default.play?.(context);
        await expect(new FormData(form).get('selection')).toBe('1');
    }
};

export const ControlledInForm: Story = {
    args: {
        ...Controlled.args,
        name: 'selection',
    },
    render: function ControlledForm(args) {
        const [value, setValue] = useState(args.value);
        return <form><SelectItems {...args} value={value} onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
        }} /></form>;
    },
    play: async (context) => {
        const form = context.canvasElement.querySelector('form')!;
        await expect(new FormData(form).get('selection')).toBe('1');
        await Controlled.play?.(context);
        await expect(new FormData(form).get('selection')).toBe('2');
    }
};

export const Placeholder: Story = {
    args: {
        ...Default.args,
        defaultValue: undefined,
    },
    play: async ({ canvasElement, args }) => {
        const trigger = within(canvasElement).getByRole('combobox');
        await expect(trigger).toHaveTextContent('Please select an option...');
        await userEvent.click(trigger);
        await userEvent.click(within(canvasElement.ownerDocument.body).getByRole('option', { name: 'Option 2' }));
        await expect(trigger).toHaveTextContent('Option 2');
        await expect(args.onValueChange).toHaveBeenLastCalledWith('2');
    }
};

export const PlaceholderInForm: Story = {
    args: {
        ...Placeholder.args,
        name: 'selection',
    },
    render: (args) => <form><SelectItems {...args} /></form>,
    play: async (context) => {
        const form = context.canvasElement.querySelector('form')!;
        await expect(new FormData(form).get('selection')).toBe('');
        await expect(context.args.onValueChange).not.toHaveBeenCalled();
        await Placeholder.play?.(context);
        await expect(new FormData(form).get('selection')).toBe('2');
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

export const Icons: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Select with icons.'
            }
        }
    },
    args: {
        defaultValue: "1",
        items: [
            { label: 'Option 1', value: '1', icon: <Cloud /> },
            { label: 'Option 2', value: '2', icon: <Bug /> },
            { label: 'Option 3', value: '3', icon: <Device /> },
        ]
    }
};
