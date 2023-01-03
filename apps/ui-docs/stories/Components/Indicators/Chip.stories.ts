import { Chip } from "@signalco/ui";
import { Meta, StoryObj } from "@storybook/react";

export default { component: Chip, tags: ['docsPage'], args: { children: 'Chip' } } satisfies Meta<typeof Chip>;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};