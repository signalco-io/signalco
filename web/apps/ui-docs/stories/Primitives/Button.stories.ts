import { Button } from "@signalco/ui-primitives/Button";
import { Meta, StoryObj } from "@storybook/react";

export default { component: Button, tags: ['autodocs'] } satisfies Meta<typeof Button>;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Click me'
    }
};

export const VariantPlain: Story = {
    args: {
        variant: 'plain',
        ...Default.args
    }
};

export const VariantSoft: Story = {
    args: {
        variant: 'soft',
        ...Default.args
    }
};

export const VariantSolid: Story = {
    args: {
        variant: 'solid',
        ...Default.args
    }
};

export const VariantOulined: Story = {
    args: {
        variant: 'outlined',
        ...Default.args
    }
};

export const VariantLink: Story = {
    args: {
        variant: 'link',
        ...Default.args
    }
};