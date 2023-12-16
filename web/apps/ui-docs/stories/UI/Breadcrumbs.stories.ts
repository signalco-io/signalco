import { Breadcrumbs } from "@signalco/ui/Breadcrumbs";
import { StoryObj } from "@storybook/react";

export default { component: Breadcrumbs, tags: ['autodocs'] };
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
    args: {
        items: [
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Product 1' }
        ]
    }
};