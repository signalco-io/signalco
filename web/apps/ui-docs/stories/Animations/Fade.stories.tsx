import { Card } from "@signalco/ui-primitives/Card";
import { Fade } from "@signalco/ui/Fade";
import { Stack } from "@signalco/ui-primitives/Stack";
import { StoryObj } from "@storybook/react";

export default { component: Fade, tags: ['autodocs'] };
type Story = StoryObj<typeof Fade>;

const Template: Story = {
    render: (props) => {
        return (
            <Card>
                <Stack>
                    <Fade appear={props.appear} duration={props.duration} collapsedWhenHidden={props.collapsedWhenHidden}>
                        <div style={{ width: 50, height: 50, backgroundColor: 'gray' }}></div>
                    </Fade>
                    <p>Quis et quis ex incididunt voluptate officia.</p>
                </Stack>
            </Card>
        );
    },
    args: {
        appear: true,
        duration: 500,
        collapsedWhenHidden: false
    }
};

export const Default: Story = { ...Template };