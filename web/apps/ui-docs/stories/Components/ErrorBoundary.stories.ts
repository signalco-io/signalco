import { ErrorBoundary } from "@signalco/ui/dist/ErrorBoundary";
import { StoryObj } from "@storybook/react";

export default { component: ErrorBoundary, tags: ['docsPage'] };
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {};