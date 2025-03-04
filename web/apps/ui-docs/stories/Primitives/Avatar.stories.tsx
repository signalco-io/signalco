import { Avatar } from "@signalco/ui-primitives/Avatar";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Avatar> =  { 
    component: Avatar, 
    tags: ['autodocs'],
    args: {
        children: 'SU'
    }
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const Small: Story = {
    args: { size: 'sm' }
};

export const Large: Story = {
    args: { size: 'lg' }
};

export const WithImage: Story = {
    args: { src: 'https://robohash.org/mail@ashallendesign.co.uk', alt: 'Placeholder' }
};

export const WithImageSmall: Story = {
    args: { src: 'https://robohash.org/mail@ashallendesign.co.uk', alt: 'Placeholder', size: 'sm' }
};

export const WithImageLarge: Story = {
    args: { src: 'https://robohash.org/mail@ashallendesign.co.uk', alt: 'Placeholder', size: 'lg' }
};