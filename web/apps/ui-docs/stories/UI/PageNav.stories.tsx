import { PageNav } from "@signalco/ui/Nav";
import { NavigatingButton } from "@signalco/ui/NavigatingButton";
import { Meta, StoryObj } from "@storybook/react";

const Component = PageNav;

export default {
    component: Component,
    tags: ['autodocs'],
    args: {
        children: <NavigatingButton href='#'>App</NavigatingButton>,
        logo: 'Logo',
        links: [
            { href: '#', text: 'Features' },
            { href: '#', text: 'Channels' },
            { href: '#', text: 'Pricing' }
        ]
    },
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Component>;

export const Default: Story = {};