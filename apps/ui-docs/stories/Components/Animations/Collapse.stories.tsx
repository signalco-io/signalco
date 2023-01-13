import { Card, Collapse, Stack } from "@signalco/ui";
import { StoryObj } from "@storybook/react";

export default { component: Collapse, tags: ['autodocs'] };
type Story = StoryObj<typeof Collapse>;

const Template: Story = {
    render: (props) => {
        return (
            <Card>
                <Stack>
                    <Collapse appear={props.appear} duration={props.duration}>
                        <div style={{ width: 50, height: 50, backgroundColor: 'gray' }}></div>
                    </Collapse>
                    <p>Quis et quis ex incididunt voluptate officia.</p>
                </Stack>
            </Card>
        );
    },
    args: {
        appear: true,
        duration: 200
    }
};

export const Default: Story = { ...Template };

export const AppearTrueOnMount: Story = { ...Template, args: { appear: true } };

export const AppearFalseOnMount: Story = { ...Template, args: { appear: false } };