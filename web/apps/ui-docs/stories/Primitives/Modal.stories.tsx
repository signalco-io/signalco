import { Button } from "@signalco/ui-primitives/Button";
import { Modal } from "@signalco/ui-primitives/Modal";
import { StoryObj } from "@storybook/react";

export default {
    component: Modal,
    tags: ['autodocs'],
    args: {
        title: "Modal Title",
        trigger: <Button>Open Modal</Button>,
        mobileOverride: false,
        disableMobile: false,
        modal: true,
        dismissible: true,
        children: (
            <div className="flex flex-col gap-4">
                <p>
                    This is a modal dialog. It can be used to display important information or gather user input.
                </p>
            </div>
        ),
    }
};
type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const ModalOverride: Story = {
    args: {
        modal: true,
    }
};

export const MobileOverride: Story = {
    args: {
        mobileOverride: true,
    }
};

export const NotDismissible: Story = {
    args: {
        dismissible: false,
    }
};