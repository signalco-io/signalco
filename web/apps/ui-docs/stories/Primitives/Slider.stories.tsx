import { Slider } from "@signalco/ui-primitives/Slider";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Slider> =  { 
    component: Slider, 
    tags: ['autodocs'],
    args: {
    }
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {};
