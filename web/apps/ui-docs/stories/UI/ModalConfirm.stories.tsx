import { Button } from "@signalco/ui-primitives/Button";
import { ModalConfirm } from "@signalco/ui/ModalConfirm";
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
