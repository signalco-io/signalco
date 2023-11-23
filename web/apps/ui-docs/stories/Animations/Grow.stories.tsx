import { Card } from "@signalco/ui-primitives/Card";
import { Grow } from "@signalco/ui/Grow";
import { Stack } from "@signalco/ui-primitives/Stack";
import { StoryObj } from "@storybook/react";

export default { component: Grow, tags: ['autodocs'] };
type Story = StoryObj<typeof Grow>;

const Template: Story = {
    render: (props) => {
        return (
            <Card>
                <Stack>
                    <Grow appear={props.appear} duration={props.duration} collapsedWhenHidden={props.collapsedWhenHidden}>
                        <div style={{ width: 50, height: 50, backgroundColor: 'gray' }}></div>
                    </Grow>
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