import { EditableInput } from "@signalco/ui/EditableInput";
import { StoryObj } from "@storybook/nextjs";
import { Stack } from '@signalco/ui-primitives/Stack';
import { Button } from '@signalco/ui-primitives/Button';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

export default { component: EditableInput, tags: ['autodocs'] };
type Story = StoryObj<typeof EditableInput>;

export const Default: Story = {
    args: {
        value: 'Editable input'
    }
};

export const Loading: Story = {
    args: {
        value: '',
        isLoading: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const status = canvas.getByRole('status', { name: 'Loading editable input' });

        await expect(status).toHaveAttribute('aria-busy', 'true');
        await userEvent.click(status);
        await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
        await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    }
};

export const LoadingWithTypography: Story = {
    args: Loading.args,
    render: (args) => (
        <Stack spacing={2}>
            <EditableInput {...args} className="text-sm" />
            <EditableInput {...args} className="text-3xl" />
            <div className="text-2xl">
                <EditableInput {...args} />
            </div>
        </Stack>
    )
};

export const LoadingTransition: Story = {
    args: {
        value: 'Editable input',
        onChange: fn(),
    },
    render: function LoadingTransition({ value: initialValue, onChange, ...args }) {
        const [value, setValue] = useState(initialValue);
        const [isLoading, setIsLoading] = useState(true);

        return (
            <Stack spacing={2}>
                <Button onClick={() => setIsLoading(!isLoading)}>
                    {isLoading ? 'Resolve loading' : 'Start loading'}
                </Button>
                <Button onClick={() => {
                    setValue('Refreshed value');
                    setIsLoading(false);
                }}>
                    Resolve with new value
                </Button>
                <EditableInput
                    {...args}
                    value={value}
                    isLoading={isLoading}
                    onChange={(nextValue) => {
                        setValue(nextValue);
                        onChange(nextValue);
                    }}
                />
            </Stack>
        );
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByRole('status')).toHaveAttribute('aria-busy', 'true');
        await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve loading' }));
        await expect(canvas.queryByRole('status')).not.toBeInTheDocument();

        await userEvent.click(canvas.getByRole('button', { name: 'Editable input' }));
        let input = canvas.getByRole('textbox');
        await expect(input).toHaveFocus();
        await userEvent.clear(input);
        await userEvent.type(input, 'Saved value');
        await userEvent.keyboard('{Enter}');
        await expect(canvas.getByRole('button', { name: 'Saved value' })).toBeVisible();
        await expect(args.onChange).toHaveBeenLastCalledWith('Saved value');

        await userEvent.click(canvas.getByRole('button', { name: 'Saved value' }));
        input = canvas.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'Discarded value');
        await userEvent.keyboard('{Escape}');
        await expect(canvas.getByRole('button', { name: 'Saved value' })).toBeVisible();
        await expect(args.onChange).toHaveBeenCalledTimes(1);

        await userEvent.click(canvas.getByRole('button', { name: 'Saved value' }));
        input = canvas.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'Draft value');
        await userEvent.click(canvas.getByRole('button', { name: 'Start loading' }));
        await expect(canvas.getByRole('status')).toHaveAttribute('aria-busy', 'true');
        await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
        await expect(canvas.queryByRole('button', { name: 'Confirm edit' })).not.toBeInTheDocument();
        await expect(canvas.queryByRole('button', { name: 'Cancel edit' })).not.toBeInTheDocument();
        await expect(args.onChange).toHaveBeenCalledTimes(1);
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve loading' }));
        input = canvas.getByRole('textbox');
        await expect(input).toHaveValue('Draft value');
        await expect(input).toHaveFocus();
        await userEvent.click(canvas.getByRole('button', { name: 'Confirm edit' }));
        await expect(canvas.getByRole('button', { name: 'Draft value' })).toBeVisible();
        await expect(args.onChange).toHaveBeenLastCalledWith('Draft value');

        await userEvent.click(canvas.getByRole('button', { name: 'Draft value' }));
        await userEvent.type(canvas.getByRole('textbox'), ' discarded');
        await userEvent.click(canvas.getByRole('button', { name: 'Start loading' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve with new value' }));
        await expect(canvas.getByRole('textbox')).toHaveValue('Refreshed value');
        await userEvent.click(canvas.getByRole('button', { name: 'Cancel edit' }));
        await expect(canvas.getByRole('button', { name: 'Refreshed value' })).toBeVisible();
        await expect(args.onChange).toHaveBeenCalledTimes(2);
    }
};
