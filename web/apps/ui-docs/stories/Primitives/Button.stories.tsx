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

export const Plain: Story = {
    args: {
        variant: 'plain',
        ...Default.args
    }
};

export const PlainOnBackground: Story = {
    args: {
        variant: 'plain',
        ...Default.args
    },
    decorators: [
        (Story) => (
            <div className="p-4 bg-muted">
                <Story />
            </div>
        )
    ]
};

export const PlainOnCard: Story = {
    args: {
        variant: 'plain',
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

export const PlainOnMuted: Story = {
    args: {
        variant: 'plain',
        ...Default.args
    },
    decorators: [
        (Story) => (
            <div className="p-4 bg-muted">
                <Story />
            </div>
        )
    ]
};

export const Soft: Story = {
    args: {
        variant: 'soft',
        ...Default.args
    }
};

export const SoftOnBackground: Story = {
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

export const SoftOnCard: Story = {
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

export const SoftOnMuted: Story = {
    args: {
        variant: 'soft',
        ...Default.args
    },
    decorators: [
        (Story) => (
            <div className="p-4 bg-muted">
                <Story />
            </div>
        )
    ]
};

export const Solid: Story = {
    args: {
        variant: 'solid',
        ...Default.args
    }
};

export const Oulined: Story = {
    args: {
        variant: 'outlined',
        ...Default.args
    }
};

export const Link: Story = {
    args: {
        variant: 'link',
        ...Default.args
    }
};