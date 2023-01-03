import { ErrorBoundary } from "@signalco/ui";
import { StoryObj } from "@storybook/react";

export default { component: ErrorBoundary, tags: ['docsPage'] };
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {};