import { NoDataPlaceholder } from "@signalco/ui/NoDataPlaceholder";
import { Meta, StoryObj } from "@storybook/react";

const Component = NoDataPlaceholder;

export default { component: Component, tags: ['autodocs'], args: { children: 'No data' } } satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Component>;

export const Default: Story = {};