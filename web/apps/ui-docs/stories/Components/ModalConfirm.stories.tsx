import { Button } from "@signalco/ui/dist/Button";
import { ModalConfirm } from "@signalco/ui/dist/ModalConfirm";
import { Meta, StoryObj } from "@storybook/react";

export default {
    component: ModalConfirm,
    tags: ['autodocs'],
    args: {
        header: "Are you sure?",
        trigger: <Button>Open</Button>,
        onConfirm: () => console.log('confirmed')
    }
} satisfies Meta<typeof ModalConfirm>;
type Story = StoryObj<typeof ModalConfirm>;

export const Default: Story = {};
