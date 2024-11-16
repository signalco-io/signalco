import { Button } from "@signalco/ui-primitives/Button";
import { Card } from "@signalco/ui-primitives/Card";
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

export const VariantSoftOnBackground: Story = {
    args: {
        variant: 'soft',
        ...Default.args
    },
    decorators: [
        (Story) => (
            <div className="p-4 bg-background">
                <Story />
            </div>
        )
    ]
};

export const VariantSoftOnCard: Story = {
    args: {
        variant: 'soft',
        ...Default.args
    },
    decorators: [
        (Story) => (
            <Card>
                <Story />
            </Card>
        )
    ]
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