import { ErrorBoundary } from "@signalco/ui/ErrorBoundary";
import { StoryObj } from "@storybook/nextjs";

export default { component: ErrorBoundary, tags: ['docsPage'] };
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {};