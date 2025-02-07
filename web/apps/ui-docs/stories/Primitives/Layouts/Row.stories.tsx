import { Row } from "@signalco/ui-primitives/Row";
import { StoryObj } from "@storybook/react";

export default { 
    component: Row, 
    tags: ['autodocs'],
    args: {
        children: [
            <span>First</span>,
            <span>Second</span>,
            <span>Third</span>
        ]
    }    
};
type Story = StoryObj<typeof Row>;

export const Default: Story = {};