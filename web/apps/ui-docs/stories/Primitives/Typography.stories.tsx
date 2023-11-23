import { Typography } from "@signalco/ui-primitives/Typography";
import { Meta, StoryObj } from "@storybook/react";

export default {
    component: Typography,
    tags: ['autodocs'],
    args: {
        children: 'Culpa fugiat eiusmod reprehenderit officia laborum ex incididunt voluptate dolor.'
    }
} satisfies Meta<typeof Typography>;
type Story = StoryObj<typeof Typography>;

const Template: Story = {
    render: (args) => (
        <Typography {...args} />
    )
}

export const Default: Story = { ...Template };

export const Heading1: Story = { ...Template, args: { level: 'h1', children: 'H1' } };

export const Heading2: Story = { ...Template, args: { level: 'h2', children: 'H2' } };

export const Heading3: Story = { ...Template, args: { level: 'h3', children: 'H3' } };

export const Heading4: Story = { ...Template, args: { level: 'h4', children: 'H4' } };

export const Heading5: Story = { ...Template, args: { level: 'h5', children: 'H5' } };

export const Heading6: Story = { ...Template, args: { level: 'h6', children: 'H6' } };

export const Body1: Story = { ...Template, args: { level: 'body1', children: 'Body 1' } };

export const Body2: Story = { ...Template, args: { level: 'body2', children: 'Body 2' } };

export const Body3: Story = { ...Template, args: { level: 'body3', children: 'Body 3' } };