import { Info } from "@signalco/ui-icons";
import { Stack } from "@signalco/ui-primitives/Stack";
import { Tooltip, TooltipTrigger, TooltipContent } from "@signalco/ui-primitives/Tooltip";
import { Typography } from "@signalco/ui-primitives/Typography";
import { StoryObj } from "@storybook/react";

export default {
    component: Tooltip,
    tags: ['autodocs'],
    args: {
        delayDuration: 0,
        children: (
            <>
                <TooltipTrigger>
                    <Info />
                </TooltipTrigger>
                <TooltipContent>
                    <Stack>
                        <Typography level="body1">Tooltip content</Typography>
                        <Typography level="body2">Example of tooltip with components as children</Typography>
                    </Stack>
                </TooltipContent>
            </>
        )
    }
};
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    decorators: [
        (Story) => (
            <div className="p-8 flex flex-col items-center">
                <Story />
            </div>
        )
    ]
};