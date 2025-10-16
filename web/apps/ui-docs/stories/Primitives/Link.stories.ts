import { Link } from "@signalco/ui-primitives/Link";
import { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta<typeof Link> = { component: Link, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};